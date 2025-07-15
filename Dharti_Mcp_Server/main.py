# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
from client_api import LLM_Client
from voice_services import transcribe_audio, synthesize_text

app = FastAPI()
llm_client = LLM_Client()

class STTRequest(BaseModel):
    audio_base64: str
    language_code: str = "en-IN"

class TTSRequest(BaseModel):
    text: str
    language_code: str = "en-IN"

class PromptRequest(BaseModel):
    prompt: str

@app.post("/prompt")
async def get_response(req: PromptRequest):
    result = await llm_client.send_prompt(req.prompt)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"response": result}

@app.post("/stt")
async def speech_to_text(req: STTRequest):
    try:
        transcript = transcribe_audio(req.audio_base64, req.language_code)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(req: TTSRequest):
    try:
        audio_base64 = synthesize_text(req.text, req.language_code)
        return {"audio_base64": audio_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


