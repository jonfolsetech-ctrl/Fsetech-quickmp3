import os
import uuid
import httpx
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydub import AudioSegment

# --------------------
# Config
# --------------------
BASE_DIR = Path(__file__).parent
MEDIA_DIR = BASE_DIR / "generated"
MEDIA_DIR.mkdir(exist_ok=True)

# AI Service API Keys (set via environment variables)
SUNO_API_KEY = os.getenv("SUNO_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Feature flags - enable services when API keys are available
USE_SUNO = bool(SUNO_API_KEY)
USE_ELEVENLABS = bool(ELEVENLABS_API_KEY)
USE_OPENAI = bool(OPENAI_API_KEY)

app = FastAPI(
    title="QuickMP3 by FolseTech AI Solutions",
    description="Lyrics-to-song generator backend demo for FolseTech AI Solutions.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; lock down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Helper functions (stubs for real AI calls)
# --------------------


async def generate_instrumental(lyrics: str, genre: str) -> Path:
    """
    Generate instrumental music using Suno API or fallback to stub.
    
    To use Suno:
    1. Get API key from https://suno.ai
    2. Set environment variable: SUNO_API_KEY=your_key_here
    
    API endpoint: POST https://api.suno.ai/v1/generate
    """
    if USE_SUNO:
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    "https://api.suno.ai/v1/generate",
                    headers={
                        "Authorization": f"Bearer {SUNO_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "prompt": f"{genre} instrumental music for lyrics: {lyrics[:200]}",
                        "make_instrumental": True,
                        "wait_audio": True,
                    },
                )
                
                if response.status_code == 200:
                    data = response.json()
                    audio_url = data.get("audio_url")
                    
                    # Download the generated audio
                    audio_response = await client.get(audio_url)
                    out_path = MEDIA_DIR / f"instrumental_{uuid.uuid4().hex}.mp3"
                    
                    with open(out_path, "wb") as f:
                        f.write(audio_response.content)
                    
                    return out_path
        except Exception as e:
            print(f"Suno API error: {e}, falling back to stub")
    
    # Fallback: generate stub audio
    out_path = MEDIA_DIR / f"instrumental_{uuid.uuid4().hex}.wav"
    silence = AudioSegment.silent(duration=10000)  # 10 seconds of silence
    silence.export(out_path, format="wav")
    return out_path


async def synthesize_vocals(lyrics: str, voice_sample_path: Optional[Path], genre: str) -> Path:
    """
    Generate vocals using ElevenLabs API or fallback to stub.
    
    To use ElevenLabs:
    1. Get API key from https://elevenlabs.io
    2. Set environment variable: ELEVENLABS_API_KEY=your_key_here
    
    API endpoint: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
    """
    if USE_ELEVENLABS:
        try:
            # Use a default voice or voice cloning if sample provided
            voice_id = "21m00Tcm4TlvDq8ikWAM"  # Default voice (Rachel)
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                # If voice sample provided, use voice cloning
                if voice_sample_path and voice_sample_path.exists():
                    # Voice cloning endpoint
                    with open(voice_sample_path, "rb") as f:
                        files = {"file": f}
                        clone_response = await client.post(
                            "https://api.elevenlabs.io/v1/voices/add",
                            headers={"xi-api-key": ELEVENLABS_API_KEY},
                            files=files,
                            data={"name": f"voice_{uuid.uuid4().hex[:8]}"},
                        )
                        
                        if clone_response.status_code == 200:
                            voice_id = clone_response.json().get("voice_id")
                
                # Generate speech
                response = await client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={
                        "xi-api-key": ELEVENLABS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    json={
                        "text": lyrics,
                        "model_id": "eleven_multilingual_v2",
                        "voice_settings": {
                            "stability": 0.5,
                            "similarity_boost": 0.75,
                        },
                    },
                )
                
                if response.status_code == 200:
                    out_path = MEDIA_DIR / f"vocals_{uuid.uuid4().hex}.mp3"
                    with open(out_path, "wb") as f:
                        f.write(response.content)
                    return out_path
        except Exception as e:
            print(f"ElevenLabs API error: {e}, falling back to stub")
    
    # Fallback: generate stub audio
    out_path = MEDIA_DIR / f"vocals_{uuid.uuid4().hex}.wav"
    silence = AudioSegment.silent(duration=10000)  # 10 seconds of silence
    silence.export(out_path, format="wav")
    return out_path


def mix_tracks(instrumental_path: Path, vocal_path: Path) -> Path:
    """
    Very basic mixing using pydub overlay.
    """
    instrumental = AudioSegment.from_file(instrumental_path)
    vocals = AudioSegment.from_file(vocal_path)

    # Simple overlay (vocals -3 dB)
    vocals = vocals - 3
    mixed = instrumental.overlay(vocals)

    out_path = MEDIA_DIR / f"song_{uuid.uuid4().hex}.mp3"
    mixed.export(out_path, format="mp3", bitrate="192k")
    return out_path


# --------------------
# API Routes
# --------------------


@app.post("/api/generate-song")
async def generate_song(
    lyrics: str = Form(...),
    genre: str = Form(...),
    voice_sample: Optional[UploadFile] = File(None),
):
    """
    Main endpoint: accepts lyrics, genre, and optional voice sample.
    Returns URL + metadata for the generated song.
    """
    try:
        voice_sample_path = None
        if voice_sample is not None:
            ext = os.path.splitext(voice_sample.filename or "")[1] or ".wav"
            voice_sample_path = MEDIA_DIR / f"voice_{uuid.uuid4().hex}{ext}"
            with open(voice_sample_path, "wb") as f:
                f.write(await voice_sample.read())

        instrumental_path = await generate_instrumental(lyrics, genre)
        vocal_path = await synthesize_vocals(lyrics, voice_sample_path, genre)
        song_path = mix_tracks(instrumental_path, vocal_path)

        file_name = song_path.name

        return {
            "success": True,
            "file_name": file_name,
            "song_url": f"/media/{file_name}",
            "metadata": {
                "genre": genre,
                "duration_seconds": 10,
                "id": uuid.uuid4().hex,
                "brand": "FolseTech AI Solutions",
            },
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )


@app.get("/media/{file_name}")
def get_media(file_name: str):
    """
    Serve generated audio files.
    """
    file_path = MEDIA_DIR / file_name
    if not file_path.exists():
        return JSONResponse(status_code=404, content={"detail": "File not found"})
    return FileResponse(file_path, media_type="audio/mpeg", filename=file_name)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "brand": "FolseTech AI Solutions",
        "app": "QuickMP3",
        "ai_services": {
            "suno": USE_SUNO,
            "elevenlabs": USE_ELEVENLABS,
            "openai": USE_OPENAI,
        },
    }
