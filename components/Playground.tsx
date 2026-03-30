import os
import time
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client
from router_logic import NeuralRouterV2

# 1. Initial Configuration
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not url or not key:
    print("❌ CRITICAL ERROR: SUPABASE_URL or KEY missing in environment variables.")
    supabase = None
else:
    supabase = create_client(url, key)
    print("✅ Connection to Supabase established.")

app = FastAPI(title="NeuralRouting.io Gateway v3.5 - Production")

# --- 2. THE CORS FIX (PRIORITY #1) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vercel and any other origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# --- 3. EXPLICIT OPTIONS HANDLER ---
# This stops the "Failed to fetch" caused by Preflight requests
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return {}

# --- 4. SECURITY & CLIENTS ---
CLIENT_KEYS = {
    os.getenv("INTERNAL_API_KEY"): "Admin_Master",
    "key_optica_2026": "Optica_Carballo",
    "key_demo_user": "Demo_Client"
}

API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_client_id(api_key: str = Depends(api_key_header)):
    if api_key in CLIENT_KEYS:
        return CLIENT_KEYS[api_key]
    
    raise HTTPException(
        status_code=403, 
        detail="Invalid API Key. Contact support@neuralrouting.io"
    )

router = NeuralRouterV2()

class PromptRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "guest_user"

# --- 5. MAIN DISPATCH ROUTE ---
@app.post("/v1/dispatch")
async def dispatch(data: PromptRequest, client_id: str = Depends(get_client_id)):
    start_time = time.perf_counter()
    
    # Neural Routing Execution
    result = router.execute_route(data.prompt)
    
    total_latency = (time.perf_counter() - start_time) * 1000
    
    # Persist to Supabase
    if supabase:
        log_data = {
            "user_id": data.user_id,
            "prompt_preview": data.prompt[:50],
            "model_selected": result["model_used"],
            "cost_saved": float(result["savings"]),
            "latency_ms": int(total_latency),
            "status": "success"
        }
        
        try:
            supabase.table("routing_logs").insert(log_data).execute()
        except Exception as e:
            print(f"⚠️ Supabase Log Error: {e}")

    return {
        "status": "success",
        "routing": {
            "selected_tier": result["tier"],
            "model_used": result["model_used"],
            "latency_ms": round(total_latency, 2)
        },
        "business_metrics": {
            "estimated_savings_usd": result["savings"]
        },
        "output": {
            "ai_answer": result["ai_response"]
        }
    }
