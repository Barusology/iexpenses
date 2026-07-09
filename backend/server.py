from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Cookie, Header, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import uuid
import base64
import bcrypt
import jwt
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---- MongoDB ----
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---- Config ----
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret-change')
JWT_ALG = os.environ.get('JWT_ALG', 'HS256')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

app = FastAPI(title="Ledgerly – Expense Tracker API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger("expense")
logging.basicConfig(level=logging.INFO)

# ---- Preset Categories ----
PRESET_CATEGORIES = [
    {"id": "food", "name": "Food & Dining", "icon": "utensils", "color": "#00FF9D"},
    {"id": "transport", "name": "Transport", "icon": "car", "color": "#5EEAD4"},
    {"id": "shopping", "name": "Shopping", "icon": "shopping-bag", "color": "#FAFF00"},
    {"id": "bills", "name": "Bills & Utilities", "icon": "receipt", "color": "#FF3366"},
    {"id": "entertainment", "name": "Entertainment", "icon": "film", "color": "#A78BFA"},
    {"id": "health", "name": "Health", "icon": "heart-pulse", "color": "#F97316"},
    {"id": "groceries", "name": "Groceries", "icon": "shopping-cart", "color": "#22D3EE"},
    {"id": "travel", "name": "Travel", "icon": "plane", "color": "#F472B6"},
    {"id": "education", "name": "Education", "icon": "book", "color": "#60A5FA"},
    {"id": "other", "name": "Other", "icon": "more-horizontal", "color": "#A1A1AA"},
]
CATEGORY_IDS = [c["id"] for c in PRESET_CATEGORIES]

# ---- Models ----
class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=80)

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class SessionExchange(BaseModel):
    session_id: str

class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    currency: str = "INR"
    theme: str = "dark"
    auth_provider: str = "password"

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = None
    theme: Optional[str] = None
    picture: Optional[str] = None

class ExpenseInput(BaseModel):
    amount: float = Field(gt=0)
    category: str
    note: Optional[str] = ""
    merchant: Optional[str] = ""
    date: Optional[str] = None  # ISO date string
    receipt_base64: Optional[str] = None
    currency: Optional[str] = None

class ExpenseOut(BaseModel):
    id: str
    user_id: str
    amount: float
    category: str
    note: str = ""
    merchant: str = ""
    date: str
    receipt_base64: Optional[str] = None
    currency: str = "INR"
    created_at: str

class OCRInput(BaseModel):
    image_base64: str

# ---- Utils ----
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def make_jwt(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_jwt(token: str) -> Optional[str]:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return data.get("user_id")
    except Exception:
        return None

def user_public(doc: dict) -> UserOut:
    return UserOut(
        user_id=doc["user_id"],
        email=doc["email"],
        name=doc.get("name", ""),
        picture=doc.get("picture"),
        currency=doc.get("currency", "INR"),
        theme=doc.get("theme", "dark"),
        auth_provider=doc.get("auth_provider", "password"),
    )

async def get_current_user(
    request: Request,
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    # Prefer cookie session (Emergent OAuth); fallback to Bearer token
    if session_token:
        sess = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
        if sess:
            expires_at = sess["expires_at"]
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at >= datetime.now(timezone.utc):
                user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
                if user:
                    return user
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        # Try JWT first
        uid = decode_jwt(token)
        if uid:
            user = await db.users.find_one({"user_id": uid}, {"_id": 0})
            if user:
                return user
        # Then try as an Emergent session_token
        sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
        if sess:
            user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
            if user:
                return user
    raise HTTPException(status_code=401, detail="Not authenticated")

# ================== AUTH ==================
@api_router.post("/auth/register")
async def register(inp: RegisterInput, response: Response):
    existing = await db.users.find_one({"email": inp.email.lower()}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id,
        "email": inp.email.lower(),
        "name": inp.name,
        "password_hash": hash_password(inp.password),
        "currency": "INR",
        "theme": "dark",
        "auth_provider": "password",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    token = make_jwt(user_id)
    return {"token": token, "user": user_public(doc).model_dump()}

@api_router.post("/auth/login")
async def login(inp: LoginInput):
    user = await db.users.find_one({"email": inp.email.lower()}, {"_id": 0})
    if not user or not user.get("password_hash") or not verify_password(inp.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = make_jwt(user["user_id"])
    return {"token": token, "user": user_public(user).model_dump()}

@api_router.post("/auth/session")
async def emergent_session(inp: SessionExchange, response: Response):
    """Exchange Emergent session_id for a session_token + user record."""
    async with httpx.AsyncClient(timeout=15) as http:
        r = await http.get(EMERGENT_AUTH_URL, headers={"X-Session-ID": inp.session_id})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = r.json()
    email = data["email"].lower()
    session_token = data["session_token"]
    # Upsert user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": data.get("name", email.split("@")[0]),
            "picture": data.get("picture"),
            "password_hash": None,
            "currency": "INR",
            "theme": "dark",
            "auth_provider": "google",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user)
    else:
        # Update google info
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"picture": data.get("picture") or user.get("picture"),
                       "name": data.get("name") or user.get("name")}}
        )
        user = await db.users.find_one({"email": email}, {"_id": 0})
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": {
            "session_token": session_token,
            "user_id": user["user_id"],
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 3600,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
    return {"user": user_public(user).model_dump()}

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user_public(user).model_dump()

@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}

@api_router.put("/users/me")
async def update_profile(inp: ProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in inp.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": updates})
    fresh = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    return user_public(fresh).model_dump()

# ================== CATEGORIES ==================
@api_router.get("/categories")
async def categories():
    return PRESET_CATEGORIES

# ================== EXPENSES ==================
def normalize_date(d: Optional[str]) -> str:
    if not d:
        return datetime.now(timezone.utc).isoformat()
    try:
        # Accept 'YYYY-MM-DD' or full ISO
        if len(d) == 10:
            return datetime.fromisoformat(d).replace(tzinfo=timezone.utc).isoformat()
        parsed = datetime.fromisoformat(d.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()

@api_router.post("/expenses", response_model=ExpenseOut)
async def create_expense(inp: ExpenseInput, user: dict = Depends(get_current_user)):
    if inp.category not in CATEGORY_IDS:
        raise HTTPException(status_code=400, detail="Invalid category")
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["user_id"],
        "amount": float(inp.amount),
        "category": inp.category,
        "note": inp.note or "",
        "merchant": inp.merchant or "",
        "date": normalize_date(inp.date),
        "receipt_base64": inp.receipt_base64,
        "currency": inp.currency or user.get("currency", "INR"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.expenses.insert_one(doc)
    doc.pop("_id", None)
    return ExpenseOut(**doc)

@api_router.get("/expenses", response_model=List[ExpenseOut])
async def list_expenses(
    user: dict = Depends(get_current_user),
    category: Optional[str] = None,
    q: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    limit: int = Query(500, le=2000),
):
    query: dict = {"user_id": user["user_id"]}
    if category and category != "all":
        query["category"] = category
    if start or end:
        date_q = {}
        if start:
            date_q["$gte"] = normalize_date(start)
        if end:
            date_q["$lte"] = normalize_date(end)
        query["date"] = date_q
    if min_amount is not None or max_amount is not None:
        amt = {}
        if min_amount is not None:
            amt["$gte"] = float(min_amount)
        if max_amount is not None:
            amt["$lte"] = float(max_amount)
        query["amount"] = amt
    if q:
        pattern = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [{"note": pattern}, {"merchant": pattern}]

    docs = await db.expenses.find(query, {"_id": 0}).sort("date", -1).limit(limit).to_list(limit)
    return [ExpenseOut(**d) for d in docs]

@api_router.put("/expenses/{expense_id}", response_model=ExpenseOut)
async def update_expense(expense_id: str, inp: ExpenseInput, user: dict = Depends(get_current_user)):
    if inp.category not in CATEGORY_IDS:
        raise HTTPException(status_code=400, detail="Invalid category")
    updates = {
        "amount": float(inp.amount),
        "category": inp.category,
        "note": inp.note or "",
        "merchant": inp.merchant or "",
        "date": normalize_date(inp.date),
        "receipt_base64": inp.receipt_base64,
        "currency": inp.currency or user.get("currency", "INR"),
    }
    res = await db.expenses.update_one({"id": expense_id, "user_id": user["user_id"]}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    doc = await db.expenses.find_one({"id": expense_id}, {"_id": 0})
    return ExpenseOut(**doc)

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str, user: dict = Depends(get_current_user)):
    res = await db.expenses.delete_one({"id": expense_id, "user_id": user["user_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"ok": True}

# ================== ANALYTICS ==================
def _bucket_start(dt: datetime, period: str) -> str:
    dt = dt.astimezone(timezone.utc)
    if period == "daily":
        b = dt.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "weekly":
        b = (dt - timedelta(days=dt.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "monthly":
        b = dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == "yearly":
        b = dt.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        b = dt
    return b.date().isoformat() if period != "yearly" else str(b.year)

@api_router.get("/analytics/summary")
async def analytics_summary(
    user: dict = Depends(get_current_user),
    period: Literal["daily", "weekly", "monthly", "yearly"] = "monthly",
):
    docs = await db.expenses.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(5000)

    total = sum(d["amount"] for d in docs)

    # Current period
    now = datetime.now(timezone.utc)
    cur_bucket = _bucket_start(now, period)
    by_bucket: dict = {}
    by_category: dict = {}
    for d in docs:
        try:
            dt = datetime.fromisoformat(d["date"].replace("Z", "+00:00"))
        except Exception:
            continue
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        b = _bucket_start(dt, period)
        by_bucket[b] = by_bucket.get(b, 0) + d["amount"]
        by_category[d["category"]] = by_category.get(d["category"], 0) + d["amount"]

    # Trend series: last 12 buckets
    series = sorted(by_bucket.items(), key=lambda x: x[0])
    trend = [{"bucket": k, "amount": round(v, 2)} for k, v in series[-12:]]

    # Category breakdown (with meta)
    meta = {c["id"]: c for c in PRESET_CATEGORIES}
    category_breakdown = []
    for cid in CATEGORY_IDS:
        amt = by_category.get(cid, 0)
        if amt > 0:
            category_breakdown.append({
                "id": cid,
                "name": meta[cid]["name"],
                "color": meta[cid]["color"],
                "icon": meta[cid]["icon"],
                "amount": round(amt, 2),
            })
    category_breakdown.sort(key=lambda x: -x["amount"])

    # Current period total
    current_period_total = by_bucket.get(cur_bucket, 0)

    # Recent expenses
    recent = sorted(docs, key=lambda d: d.get("date", ""), reverse=True)[:5]
    recent_out = [ExpenseOut(**d).model_dump() for d in recent]

    # Weekly bar (last 7 days) & monthly line (last 12 months) — extras
    weekly_bars = []
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        key = day.date().isoformat()
        total_day = 0
        for d in docs:
            try:
                dt = datetime.fromisoformat(d["date"].replace("Z", "+00:00"))
                if dt.date() == day.date():
                    total_day += d["amount"]
            except Exception:
                continue
        weekly_bars.append({"day": day.strftime("%a"), "date": key, "amount": round(total_day, 2)})

    return {
        "total_all_time": round(total, 2),
        "current_period_total": round(current_period_total, 2),
        "period": period,
        "trend": trend,
        "category_breakdown": category_breakdown,
        "recent": recent_out,
        "weekly_bars": weekly_bars,
        "transaction_count": len(docs),
        "currency": user.get("currency", "INR"),
    }

# ================== OCR ==================
def _sanitize_base64(s: str) -> str:
    if not s:
        return s
    if "," in s and s.strip().startswith("data:"):
        return s.split(",", 1)[1].strip()
    return s.strip()

@api_router.post("/receipts/ocr")
async def ocr_receipt(inp: OCRInput, user: dict = Depends(get_current_user)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    image_b64 = _sanitize_base64(inp.image_base64)
    if not image_b64:
        raise HTTPException(status_code=400, detail="image_base64 required")

    # Lazy import to avoid startup failure if pkg missing at boot
    from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

    prompt = (
        "Extract structured data from this receipt image. Respond ONLY with strict JSON, "
        "no markdown fences, exactly matching:\n"
        "{\n"
        "  \"amount\": number,           // total amount paid, numeric only\n"
        "  \"merchant\": string,         // merchant / store name\n"
        "  \"date\": string,             // ISO 'YYYY-MM-DD' if visible else today\n"
        "  \"currency\": string,         // ISO code like 'INR','USD','EUR'\n"
        "  \"suggested_category\": string // one of: food, transport, shopping, bills, entertainment, health, groceries, travel, education, other\n"
        "}\n"
        "Guess reasonably if some fields are missing. Category must be lowercase from list."
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"ocr-{uuid.uuid4().hex[:8]}",
        system_message="You are an expert receipt OCR extractor. Always output valid JSON only.",
    ).with_model("gemini", "gemini-3-flash-preview")

    try:
        reply = await chat.send_message(UserMessage(
            text=prompt,
            file_contents=[ImageContent(image_base64=image_b64)],
        ))
    except Exception as e:
        logger.exception("OCR call failed")
        raise HTTPException(status_code=502, detail=f"OCR failed: {e}")

    text = reply if isinstance(reply, str) else str(reply)
    # Try to parse json from text (strip code fences if present)
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        data = json.loads(cleaned)
    except Exception:
        # try to find json blob
        m = re.search(r"\{[\s\S]*\}", cleaned)
        if not m:
            raise HTTPException(status_code=502, detail="OCR returned unparseable output")
        try:
            data = json.loads(m.group(0))
        except Exception:
            raise HTTPException(status_code=502, detail="OCR JSON parse failed")

    cat = str(data.get("suggested_category", "other")).lower().strip()
    if cat not in CATEGORY_IDS:
        cat = "other"

    return {
        "amount": float(data.get("amount") or 0),
        "merchant": str(data.get("merchant") or ""),
        "date": str(data.get("date") or datetime.now(timezone.utc).date().isoformat()),
        "currency": str(data.get("currency") or user.get("currency", "INR")).upper(),
        "suggested_category": cat,
        "raw": data,
    }

# ================== Health ==================
@api_router.get("/")
async def root():
    return {"service": "expense-tracker", "ok": True}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
