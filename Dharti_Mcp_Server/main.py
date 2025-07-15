# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
from client_api import LLM_Client

app = FastAPI()
llm_client = LLM_Client()

class PromptRequest(BaseModel):
    prompt: str

@app.post("/prompt")
async def get_response(req: PromptRequest):
    result = await llm_client.send_prompt(req.prompt)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"response": result}


