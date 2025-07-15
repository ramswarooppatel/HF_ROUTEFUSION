from google.cloud import speech, texttospeech
import base64
from dotenv import load_dotenv

load_dotenv()
# Initialize Clients (Recommended to initialize globally)
speech_client = speech.SpeechClient()
tts_client = texttospeech.TextToSpeechClient()

def transcribe_audio(base64_audio: str, language_code="en-IN") -> str:
    audio_content = base64.b64decode(base64_audio)
    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code=language_code,
    )
    response = speech_client.recognize(config=config, audio=audio)
    return response.results[0].alternatives[0].transcript if response.results else ""

def synthesize_text(text: str, language_code="en-IN") -> str:
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.MALE,
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
    )
    response = tts_client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )
    return base64.b64encode(response.audio_content).decode("utf-8")