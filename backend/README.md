# YURUS IPC Mapper Backend

Flask backend for the YURUS IPC Section Mapper application.

## Features

- **IPC Finder**: Uses sentence transformers to find relevant IPC sections based on complaint descriptions
- **General Chat**: Integrates with Google Gemini API for general queries
- **CORS Enabled**: Allows frontend communication

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

Set your Gemini API key as an environment variable:

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
```

**Windows (CMD):**
```cmd
set GEMINI_API_KEY=your-api-key-here
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. IPC Finder
**POST** `/api/ipc-finder`

Find relevant IPC section for a complaint.

**Request Body:**
```json
{
  "complaint": "Someone stole my mobile phone"
}
```

**Response:**
```json
{
  "success": true,
  "ipc_section": "379",
  "description": "Theft case description",
  "fir_id": "FIR123",
  "similarity_score": 0.85,
  "message": "Based on your complaint, the relevant IPC section is: 379"
}
```

### 2. General Chat
**POST** `/api/general-chat`

General conversation using Gemini API.

**Request Body:**
```json
{
  "message": "What is IPC Section 302?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "IPC Section 302 deals with punishment for murder..."
}
```

### 3. Health Check
**GET** `/api/health`

Check server status.

**Response:**
```json
{
  "status": "healthy",
  "dataset_loaded": true,
  "gemini_configured": true
}
```

## Files

- `app.py` - Main Flask application
- `transformer.py` - Original transformer script (kept for reference)
- `dataset_with_embeddings.json` - Pre-computed embeddings dataset
- `requirements.txt` - Python dependencies

## Notes

- The IPC finder uses a similarity threshold of 0.3
- Make sure `dataset_with_embeddings.json` exists before running
- Gemini API key is required for general chat functionality
