# AI Services Setup Guide

This guide explains how to configure real AI services for QuickMP3.

## 🎵 Current Integration Status

The app now supports **real AI music and voice generation** with automatic fallback to stubs when API keys aren't configured.

### ✅ Integrated Services

1. **Suno AI** - Music/Instrumental Generation
2. **ElevenLabs** - Voice Synthesis & Cloning

---

## 🔑 Step-by-Step Setup

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Get API Keys

#### Suno AI (Music Generation)

1. Visit [https://suno.ai](https://suno.ai)
2. Sign up for an account
3. Navigate to your account settings
4. Copy your API key
5. Add to `.env`: `SUNO_API_KEY=your_key_here`

**What it does:**
- Generates instrumental music based on genre and lyrics
- Creates background tracks automatically
- Supports various music genres

#### ElevenLabs (Voice Synthesis)

1. Visit [https://elevenlabs.io](https://elevenlabs.io)
2. Create an account
3. Go to your profile settings
4. Copy your API key
5. Add to `.env`: `ELEVENLABS_API_KEY=your_key_here`

**What it does:**
- Converts lyrics text to sung vocals
- Supports voice cloning from uploaded samples
- High-quality voice synthesis

### 3. Restart the Backend

```bash
# Stop the current server (Ctrl+C)
# Then restart:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Verify Services Are Active

Visit: `http://localhost:8000/health`

You should see:
```json
{
  "status": "ok",
  "ai_services": {
    "suno": true,          // ✅ If SUNO_API_KEY is set
    "elevenlabs": true,    // ✅ If ELEVENLABS_API_KEY is set
    "openai": false        // Reserved for future features
  }
}
```

---

## 🛠 How It Works

### Without API Keys
- **Instrumental**: 10-second silence placeholder
- **Vocals**: 10-second silence placeholder
- **Mixed Output**: Basic stub audio file
- **Use Case**: Testing UI/UX, development

### With API Keys
- **Instrumental**: Real AI-generated music from Suno
- **Vocals**: Real voice synthesis from ElevenLabs
- **Mixed Output**: Professional-quality song
- **Use Case**: Production, demos, real users

### Graceful Fallback
If an API call fails (network issues, rate limits, etc.):
- Automatically falls back to stub audio
- Logs error to console
- App continues working

---

## 💡 API Features Used

### Suno AI Integration
```python
# Location: main.py -> generate_instrumental()
- Endpoint: POST https://api.suno.ai/v1/generate
- Prompt: f"{genre} instrumental music for lyrics: {lyrics}"
- Output: MP3 audio file
```

### ElevenLabs Integration
```python
# Location: main.py -> synthesize_vocals()
- Endpoint: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
- Voice Cloning: POST https://api.elevenlabs.io/v1/voices/add
- Output: MP3 audio file with synthesized vocals
```

---

## 📊 Testing Your Setup

1. Start both servers (backend and frontend)
2. Open `http://localhost:5173`
3. Enter some lyrics and select a genre
4. Click "Generate Song"
5. Watch the console logs to see which services are being used

### Expected Logs

**With API Keys:**
```
INFO: Generating instrumental with Suno AI
INFO: Synthesizing vocals with ElevenLabs
INFO: Mixing tracks...
```

**Without API Keys (Fallback):**
```
INFO: Using stub instrumental (no SUNO_API_KEY)
INFO: Using stub vocals (no ELEVENLABS_API_KEY)
INFO: Mixing stub tracks...
```

---

## 🚀 Cost & Rate Limits

### Suno AI
- Check their pricing page for current rates
- Typically charged per generation
- May have free tier or trial credits

### ElevenLabs
- Free tier: 10,000 characters/month
- Paid plans for higher usage
- Voice cloning requires paid plan

**Tip:** Start with free tiers to test, then upgrade as needed.

---

## 🔒 Security Best Practices

1. **Never commit `.env` file to git**
   - Already in `.gitignore`
   
2. **Use environment variables in production**
   - Render, Railway, AWS: Set in dashboard
   - Vercel: Use environment variables settings
   
3. **Rotate keys regularly**
   - If keys are exposed, regenerate immediately

---

## 🐛 Troubleshooting

### "API key invalid" error
- Double-check your key is correct
- Ensure no extra spaces in `.env`
- Verify key hasn't expired

### "Rate limit exceeded"
- Check your API plan limits
- Implement caching if needed
- Upgrade to higher tier

### Services showing as `false` in `/health`
- Ensure `.env` file exists in project root
- Check environment variables are loaded
- Restart backend server after adding keys

---

## 📝 Future Enhancements

Potential additions to consider:

- **OpenAI GPT** - Lyrics enhancement and songwriting assistance
- **Replicate** - Additional music models
- **Stable Audio** - Alternative music generation
- **Azure Speech** - Alternative voice synthesis
- **Caching** - Store generated audio to reduce API calls
- **Queue System** - Handle multiple concurrent requests

---

## 📞 Support

For issues with:
- **QuickMP3 App**: Check main README.md
- **Suno API**: Visit Suno AI documentation
- **ElevenLabs API**: Visit ElevenLabs documentation

---

**Ready to create amazing AI-generated songs! 🎵🎤**
