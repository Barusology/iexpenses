from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import re
import json
import uuid
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---- Config ----
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://mnmvxakeigshvdopfvjp.supabase.co")
SUPABASE_ANON_KEY = os.environ.get(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubXZ4YWtlaWdzaHZkb3BmdmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDE4NzAsImV4cCI6MjA5OTE3Nzg3MH0.EMZDbY05xJVFSPCuJHGg6iTcPAHobknnM1oafjJmuEs"
)
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI(title="iEXPENSES – Expense Tracker API (OCR Service)")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger("expense-ocr")
logging.basicConfig(level=logging.INFO)

# ---- Categories ----
CATEGORY_IDS = [
    "food", "transport", "shopping", "bills", "entertainment", 
    "health", "groceries", "travel", "education", "other"
]

# ---- Models ----
class OCRInput(BaseModel):
    image_base64: str

# ---- Auth via Supabase API ----
async def get_current_user(authorization: Optional[str] = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1].strip()
    
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": SUPABASE_ANON_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(f"{SUPABASE_URL}/auth/v1/user", headers=headers, timeout=10)
            if r.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            data = r.json()
            return {
                "user_id": data.get("id"),
                "email": data.get("email"),
            }
        except httpx.HTTPError as e:
            logger.exception("Supabase auth check failed")
            raise HTTPException(status_code=502, detail="Auth check failed")

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
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        data = json.loads(cleaned)
    except Exception:
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
        "currency": str(data.get("currency") or "INR").upper(),
        "suggested_category": cat,
        "raw": data,
    }

# ================== Health ==================
@api_router.get("/")
async def root():
    return {"service": "expense-tracker-ocr", "ok": True}

# Include router
app.include_router(api_router)

cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
if '*' in cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origin_regex=".*",
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
