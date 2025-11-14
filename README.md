# QuickMP3 – FolseTech AI Solutions Edition

A branded demo app by **FolseTech AI Solutions** (River Parishes, LA) for turning lyrics into AI-generated songs.

This project showcases:

- 🎧 FastAPI backend
- 🎚 Stubbed AI pipeline (instrumental + vocals + mixing using pydub)
- 🎛 React frontend with FolseTech-branded UI

> ⚠️ Note: The AI parts are *stubbed*. You can wire in real services like Suno, Udio, ElevenLabs, or RVC where indicated in `backend/main.py`.

---

## ✅ Requirements

- Python 3.10+
- Node.js 18+
- ffmpeg installed on your system (required by `pydub`)

### 🔑 AI Service API Keys (Optional)

The app works with stub/placeholder audio by default. To use real AI services:

1. **Suno AI** (Music Generation): Get API key from [suno.ai](https://suno.ai)
2. **ElevenLabs** (Voice Synthesis): Get API key from [elevenlabs.io](https://elevenlabs.io)

Set up your API keys:

```bash
cp .env.example .env
# Edit .env and add your API keys
```

---

## 🖥 Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Optional: Set up AI service API keys
cp .env.example .env
# Edit .env and add your API keys (SUNO_API_KEY, ELEVENLABS_API_KEY)

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will:
- ✅ Run with stub audio if no API keys are set
- 🎵 Use Suno AI for music generation if `SUNO_API_KEY` is set
- 🎤 Use ElevenLabs for voice synthesis if `ELEVENLABS_API_KEY` is set

Check service status at `http://localhost:8000/health`

---

## 🌐 Frontend Setup

```bash
npm install
npm run dev
```

The UI is branded:

- App name: **QuickMP3 by FolseTech AI Solutions**
- Tagline: *"Transforming ideas into intelligent tracks."*
- Colors inspired by FolseTech's tech blue / teal palette.

Frontend will be available at `http://localhost:5173`

You can deploy:

- Frontend → Vercel / Netlify / Amplify
- Backend → Render, Railway, EC2, etc.

---

## 🔌 AI Services Integration

The backend now supports real AI providers with automatic fallback to stubs:

### ✅ **Already Integrated**

1. **Suno AI** - Music/Instrumental Generation
   - Set `SUNO_API_KEY` environment variable
   - Automatically generates instrumental tracks based on genre and lyrics
   
2. **ElevenLabs** - Voice Synthesis & Cloning
   - Set `ELEVENLABS_API_KEY` environment variable
   - Converts lyrics to sung vocals
   - Supports voice cloning from uploaded samples

### 🎛 **How It Works**

- **With API Keys**: Real AI-generated music and vocals
- **Without API Keys**: Placeholder audio (10-second silence) for testing
- **Graceful Fallback**: If API calls fail, automatically uses stubs

### 📊 **Check Status**

Visit `http://localhost:8000/health` to see which AI services are active:

```json
{
  "status": "ok",
  "ai_services": {
    "suno": true,
    "elevenlabs": true
  }
}
```
