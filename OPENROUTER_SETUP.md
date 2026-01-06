# OpenRouter DeepSeek Integration

## Changes Made

Successfully migrated from Google Gemini to OpenRouter's DeepSeek model for the general chat functionality.

---

## What Changed

### Backend (`backend/app.py`)

**Removed:**
- Google Gemini API integration
- `google.generativeai` import

**Added:**
- OpenRouter API integration using `requests` library
- DeepSeek v3 model (`deepseek/deepseek-chat`)
- System prompt for legal assistant context

**Configuration:**
```python
OPENROUTER_API_KEY = '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'
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
DEEPSEEK_MODEL = 'deepseek/deepseek-chat'
```

**API Request Format:**
```python
headers = {
    'Authorization': f'Bearer {OPENROUTER_API_KEY}',
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'YURUS IPC Mapper',
}

payload = {
    'model': DEEPSEEK_MODEL,
    'messages': [
        {
            'role': 'system',
            'content': 'You are a helpful legal assistant for the YURUS IPC Mapper application...'
        },
        {
            'role': 'user',
            'content': user_message
        }
    ]
}
```

---

### Frontend (`src/components/chatbot/simple-chatbot.tsx`)

**Updated:**
- Changed `GEMINI_API_KEY` to `OPENROUTER_API_KEY`
- Updated error messages to reference OpenRouter

---

### Dependencies (`backend/requirements.txt`)

**Removed:**
```
google-generativeai==0.3.2
```

**Added:**
```
requests==2.31.0
```

---

## Why OpenRouter + DeepSeek?

### Advantages:

1. **Free Tier**: DeepSeek v3 is available for free on OpenRouter
2. **No Quota Issues**: More generous rate limits
3. **Better API**: OpenAI-compatible API format
4. **Reliability**: More stable than Gemini free tier
5. **Quality**: DeepSeek v3 is a powerful open-source model

---

## How to Use

### 1. Install Dependencies (if needed)

```bash
cd backend
pip install requests==2.31.0
```

### 2. Start Backend

```bash
cd backend
python app.py
```

You should see:
```
==================================================
YURUS IPC Mapper Backend Server
==================================================
Dataset records: [number]
OpenRouter API: Configured
Model: deepseek/deepseek-chat
==================================================
```

### 3. Start Frontend

```bash
cd SIH2025_Internal
npm run dev
```

### 4. Test General Chat

1. Open chatbot
2. Select "General" mode
3. Ask: "What is IPC Section 302?"
4. Get response from DeepSeek model!

---

## API Endpoint Details

### General Chat Endpoint

**URL:** `POST /api/general-chat`

**Request:**
```json
{
  "message": "What is IPC Section 302?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "IPC Section 302 deals with punishment for murder. According to this section, whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine..."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "API request failed: [error details]"
}
```

---

## System Prompt

The DeepSeek model is configured with this system prompt:

> "You are a helpful legal assistant for the YURUS IPC Mapper application. Provide clear and accurate information about Indian Penal Code sections and legal matters."

This ensures the model provides relevant legal information in the context of IPC.

---

## Health Check

The health check endpoint now reports OpenRouter status:

**URL:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "dataset_loaded": true,
  "openrouter_configured": true,
  "model": "deepseek/deepseek-chat"
}
```

---

## Troubleshooting

### Issue: "OpenRouter API is not configured"

**Solution:** The API key is hardcoded in `app.py` line 15. Make sure it's present.

### Issue: API request fails

**Possible causes:**
1. No internet connection
2. OpenRouter service down
3. API key invalid or expired
4. Rate limit exceeded

**Check:**
- Backend console for detailed error messages
- OpenRouter dashboard: https://openrouter.ai/

### Issue: Slow responses

**Explanation:** DeepSeek is a large model, responses may take 2-5 seconds. This is normal.

---

## OpenRouter Features Used

1. **Authorization**: Bearer token authentication
2. **HTTP-Referer**: Optional header for tracking
3. **X-Title**: Optional header for app identification
4. **Chat Completions**: OpenAI-compatible API format
5. **System Messages**: For context setting

---

## Model Information

**Model:** `deepseek/deepseek-chat`
- **Provider:** DeepSeek
- **Type:** Chat completion
- **Context Length:** 64K tokens
- **Cost:** Free tier available
- **Quality:** High-quality responses for legal queries

---

## Comparison: Gemini vs DeepSeek

| Feature | Gemini | DeepSeek (OpenRouter) |
|---------|--------|----------------------|
| Cost | Free tier limited | Free tier generous |
| API Format | Google-specific | OpenAI-compatible |
| Setup | Complex | Simple |
| Rate Limits | Restrictive | Generous |
| Reliability | Variable | Stable |
| Legal Knowledge | Good | Excellent |

---

## Next Steps

1. ✅ Backend configured with OpenRouter
2. ✅ Frontend updated
3. ✅ Dependencies updated
4. ✅ System prompt optimized for legal queries

**Ready to use!** Just start both servers and test the General chat mode.

---

## API Key Security Note

⚠️ **Important:** The API key is currently hardcoded in the source files. For production:

1. Use environment variables
2. Don't commit API keys to Git
3. Add `.env` to `.gitignore`
4. Use secrets management

For development/testing, the current setup is fine.

---

## Support

For OpenRouter issues:
- Dashboard: https://openrouter.ai/
- Documentation: https://openrouter.ai/docs
- Status: https://status.openrouter.ai/

For DeepSeek model info:
- Model page: https://openrouter.ai/models/deepseek/deepseek-chat
