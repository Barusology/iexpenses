"""
Backend API tests for Ledgerly (Expense Tracker).
Covers: auth (register/login/me/session), categories, expenses CRUD,
analytics summary (daily/weekly/monthly/yearly), profile updates, OCR (best-effort).
"""
import os
import io
import base64
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fintech-dash-68.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

DEMO_EMAIL = os.environ.get("DEMO_EMAIL", "demo@ledgerly.app")
DEMO_PASSWORD = os.environ.get("DEMO_PASSWORD", "Demo1234!")


# ------------------------- Fixtures -------------------------
@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def unique_user():
    uid = uuid.uuid4().hex[:8]
    return {
        "email": f"test_{uid}@ledgerly.app",
        "password": "TestPass1234!",
        "name": f"TEST_User_{uid}",
    }


@pytest.fixture(scope="session")
def registered_token(http, unique_user):
    r = http.post(f"{API}/auth/register", json=unique_user)
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and "user" in data
    u = data["user"]
    assert u["email"] == unique_user["email"].lower()
    assert u["name"] == unique_user["name"]
    assert u.get("currency") == "INR"
    assert "user_id" in u
    return data["token"]


@pytest.fixture(scope="session")
def demo_token(http):
    # Try login first; if not seeded, register.
    r = http.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    if r.status_code == 200:
        return r.json()["token"]
    reg = http.post(f"{API}/auth/register", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD, "name": "Demo User"})
    if reg.status_code == 200:
        return reg.json()["token"]
    pytest.skip(f"Demo user unavailable: {r.status_code} {r.text}")


def _auth(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ------------------------- Health -------------------------
def test_root(http):
    r = http.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("ok") is True


# ------------------------- Auth -------------------------
class TestAuth:
    def test_register_ok(self, registered_token):
        assert isinstance(registered_token, str) and len(registered_token) > 20

    def test_register_duplicate(self, http, unique_user):
        r = http.post(f"{API}/auth/register", json=unique_user)
        assert r.status_code == 400

    def test_login_success(self, http, unique_user):
        r = http.post(f"{API}/auth/login", json={"email": unique_user["email"], "password": unique_user["password"]})
        assert r.status_code == 200
        d = r.json()
        assert "token" in d and d["user"]["email"] == unique_user["email"].lower()

    def test_login_wrong_password(self, http, unique_user):
        r = http.post(f"{API}/auth/login", json={"email": unique_user["email"], "password": "WrongPass!!"})
        assert r.status_code == 401

    def test_login_unknown_user(self, http):
        r = http.post(f"{API}/auth/login", json={"email": "no-such@ledgerly.app", "password": "whatever"})
        assert r.status_code == 401

    def test_me_with_token(self, http, registered_token, unique_user):
        r = http.get(f"{API}/auth/me", headers=_auth(registered_token))
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == unique_user["email"].lower()
        assert d["name"] == unique_user["name"]
        assert d["currency"] == "INR"
        assert "user_id" in d

    def test_me_without_token(self, http):
        r = http.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_session_invalid(self, http):
        r = http.post(f"{API}/auth/session", json={"session_id": "definitely-not-a-real-id"})
        assert r.status_code == 401


# ------------------------- Categories -------------------------
def test_categories(http):
    r = http.get(f"{API}/categories")
    assert r.status_code == 200
    cats = r.json()
    ids = {c["id"] for c in cats}
    expected = {"food", "transport", "shopping", "bills", "entertainment",
                "health", "groceries", "travel", "education", "other"}
    assert expected.issubset(ids)


# ------------------------- Expenses CRUD + Filters -------------------------
class TestExpenses:
    def test_create_expense(self, http, registered_token):
        payload = {"amount": 123.45, "category": "food", "merchant": "TEST_Cafe",
                   "note": "TEST_lunch", "date": "2026-01-05"}
        r = http.post(f"{API}/expenses", headers=_auth(registered_token), json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["amount"] == 123.45
        assert d["category"] == "food"
        assert d["merchant"] == "TEST_Cafe"
        assert "id" in d
        pytest.expense_id = d["id"]

    def test_create_invalid_category(self, http, registered_token):
        r = http.post(f"{API}/expenses", headers=_auth(registered_token),
                      json={"amount": 10, "category": "not-a-cat"})
        assert r.status_code == 400

    def test_create_without_auth(self, http):
        r = http.post(f"{API}/expenses", json={"amount": 10, "category": "food"})
        assert r.status_code == 401

    def test_list_expenses(self, http, registered_token):
        r = http.get(f"{API}/expenses", headers=_auth(registered_token))
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        assert any(e.get("merchant") == "TEST_Cafe" for e in arr)

    def test_filter_by_category(self, http, registered_token):
        # add a bills entry
        http.post(f"{API}/expenses", headers=_auth(registered_token),
                  json={"amount": 50, "category": "bills", "merchant": "TEST_Utility"})
        r = http.get(f"{API}/expenses?category=bills", headers=_auth(registered_token))
        assert r.status_code == 200
        assert all(e["category"] == "bills" for e in r.json())

    def test_filter_by_q(self, http, registered_token):
        r = http.get(f"{API}/expenses?q=TEST_Cafe", headers=_auth(registered_token))
        assert r.status_code == 200
        assert any(e["merchant"] == "TEST_Cafe" for e in r.json())

    def test_filter_by_amount_and_date(self, http, registered_token):
        r = http.get(
            f"{API}/expenses?min_amount=100&max_amount=200&start=2026-01-01&end=2026-12-31",
            headers=_auth(registered_token),
        )
        assert r.status_code == 200
        for e in r.json():
            assert 100 <= e["amount"] <= 200

    def test_update_expense(self, http, registered_token):
        eid = getattr(pytest, "expense_id", None)
        assert eid, "prerequisite create failed"
        r = http.put(f"{API}/expenses/{eid}", headers=_auth(registered_token),
                     json={"amount": 200, "category": "food", "merchant": "TEST_Cafe2",
                           "note": "updated", "date": "2026-01-06"})
        assert r.status_code == 200
        assert r.json()["amount"] == 200
        assert r.json()["merchant"] == "TEST_Cafe2"

    def test_delete_expense(self, http, registered_token):
        eid = getattr(pytest, "expense_id", None)
        r = http.delete(f"{API}/expenses/{eid}", headers=_auth(registered_token))
        assert r.status_code == 200
        # deleting again -> 404
        r2 = http.delete(f"{API}/expenses/{eid}", headers=_auth(registered_token))
        assert r2.status_code == 404


# ------------------------- Analytics -------------------------
class TestAnalytics:
    @pytest.mark.parametrize("period", ["daily", "weekly", "monthly", "yearly"])
    def test_summary_periods(self, http, registered_token, period):
        r = http.get(f"{API}/analytics/summary?period={period}", headers=_auth(registered_token))
        assert r.status_code == 200, r.text
        d = r.json()
        for key in ("total_all_time", "current_period_total", "period", "trend",
                    "category_breakdown", "recent", "weekly_bars",
                    "transaction_count", "currency"):
            assert key in d, f"missing {key} for period={period}"
        assert d["period"] == period
        assert isinstance(d["trend"], list)
        assert isinstance(d["category_breakdown"], list)
        assert isinstance(d["weekly_bars"], list) and len(d["weekly_bars"]) == 7


# ------------------------- Profile -------------------------
class TestProfile:
    def test_update_profile(self, http, registered_token):
        r = http.put(f"{API}/users/me", headers=_auth(registered_token),
                     json={"name": "TEST_Updated", "currency": "USD", "theme": "light"})
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "TEST_Updated"
        assert d["currency"] == "USD"
        assert d["theme"] == "light"

        # verify persistence via /me
        r2 = http.get(f"{API}/auth/me", headers=_auth(registered_token))
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["currency"] == "USD"
        assert d2["theme"] == "light"


# ------------------------- OCR (best effort) -------------------------
def _make_jpeg_base64():
    """Create a tiny valid JPEG using Pillow (fallback: skip)."""
    try:
        from PIL import Image, ImageDraw
    except Exception:
        return None
    img = Image.new("RGB", (300, 400), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((10, 10), "STARBUCKS", fill=(0, 0, 0))
    d.text((10, 40), "Latte  4.50", fill=(0, 0, 0))
    d.text((10, 70), "Muffin 3.20", fill=(0, 0, 0))
    d.text((10, 110), "TOTAL  7.70 USD", fill=(0, 0, 0))
    d.text((10, 150), "2026-01-05", fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=70)
    return base64.b64encode(buf.getvalue()).decode()


class TestOCR:
    def test_ocr_without_auth(self, http):
        r = http.post(f"{API}/receipts/ocr", json={"image_base64": "abc"})
        assert r.status_code == 401

    def test_ocr_receipt(self, http, registered_token):
        b64 = _make_jpeg_base64()
        if not b64:
            pytest.skip("Pillow not available for building test JPEG")
        r = http.post(f"{API}/receipts/ocr", headers=_auth(registered_token),
                      json={"image_base64": b64}, timeout=90)
        if r.status_code != 200:
            # Soft-fail per instructions: log and skip
            pytest.skip(f"OCR LLM call soft-failed: {r.status_code} {r.text[:200]}")
        d = r.json()
        for k in ("amount", "merchant", "date", "currency", "suggested_category", "raw"):
            assert k in d
        assert d["suggested_category"] in {"food", "transport", "shopping", "bills",
                                            "entertainment", "health", "groceries",
                                            "travel", "education", "other"}
        assert isinstance(d["amount"], (int, float))
