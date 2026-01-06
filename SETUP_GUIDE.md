# YURUS IPC Mapper - Complete Setup Guide

This guide will help you set up both the frontend and backend for the YURUS IPC Section Mapper application.

## Overview

YURUS is an IPC (Indian Penal Code) Section Mapper that helps users identify relevant IPC sections based on complaint descriptions. It features:

- **IPC Finder Mode**: Uses AI to match complaints with relevant IPC sections
- **General Chat Mode**: Powered by Google Gemini for general legal queries
- **Voice Input**: Supports English voice input for complaints
- **No Database Required**: Simplified architecture without chat history

---

## Backend Setup (Flask)

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask (Web framework)
- Flask-CORS (Cross-origin support)
- sentence-transformers (AI model for IPC matching)
- numpy (Numerical computations)
- google-generativeai (Gemini API)

### Step 3: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 4: Set Environment Variable

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

### Step 5: Run the Backend Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

You should see:
```
==================================================
YURUS IPC Mapper Backend Server
==================================================
Dataset records: [number]
Gemini API: Configured
==================================================
```

---

## Frontend Setup (React + Vite)

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Step 1: Navigate to Frontend Directory
```bash
cd SIH2025_Internal
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Gemini API Key

Open the file: `src/config/api-keys.ts`

```typescript
export const API_CONFIG = {
  GEMINI_API_KEY: 'your-gemini-api-key-here', // Add your key here
  BACKEND_URL: 'http://localhost:5000',
};
```

**Important:** Add your Gemini API key in this file.

### Step 4: Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

---

## Using the Application

### 1. Access the Dashboard
Open your browser and go to `http://localhost:5173`

### 2. Open the Chatbot
Click the floating chat button in the bottom-right corner

### 3. Choose a Mode

#### IPC Finder Mode
- Select "IPC Finder" from the toggle buttons
- Type or speak your complaint description
- Example: "Someone stole my mobile phone"
- The bot will respond with the relevant IPC section

#### General Chat Mode
- Select "General" from the toggle buttons
- Ask any legal or general question
- Example: "What is IPC Section 302?"
- The bot will use Gemini AI to answer

### 4. Voice Input
- Click the microphone icon to start voice input
- Speak in English
- Click again to stop recording
- The text will appear in the input field

---

## Project Structure

```
FYP/
├── backend/
│   ├── app.py                          # Flask backend server
│   ├── transformer.py                  # Original transformer script (reference)
│   ├── dataset_with_embeddings.json    # Pre-computed embeddings
│   ├── requirements.txt                # Python dependencies
│   └── README.md                       # Backend documentation
│
└── SIH2025_Internal/
    ├── src/
    │   ├── components/
    │   │   └── chatbot/
    │   │       ├── simple-chatbot.tsx  # New simplified chatbot
    │   │       └── chatbot.tsx         # Old complex chatbot (kept for reference)
    │   ├── config/
    │   │   └── api-keys.ts             # API configuration
    │   ├── pages/
    │   │   └── dashboard.tsx           # Main dashboard
    │   └── sections/
    │       └── assessment/
    │           └── complaint-table.tsx # Complaint data table
    └── package.json
```

---

## API Endpoints

### Backend (Flask)

#### 1. IPC Finder
**POST** `/api/ipc-finder`

Request:
```json
{
  "complaint": "Someone stole my mobile phone"
}
```

Response:
```json
{
  "success": true,
  "ipc_section": "379",
  "description": "Theft case description",
  "similarity_score": 0.85,
  "message": "Based on your complaint, the relevant IPC section is: 379"
}
```

#### 2. General Chat
**POST** `/api/general-chat`

Request:
```json
{
  "message": "What is IPC Section 302?"
}
```

Response:
```json
{
  "success": true,
  "message": "IPC Section 302 deals with punishment for murder..."
}
```

#### 3. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "healthy",
  "dataset_loaded": true,
  "gemini_configured": true
}
```

---

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
**Solution:** Install dependencies: `pip install -r requirements.txt`

**Problem:** `FileNotFoundError: dataset_with_embeddings.json`
**Solution:** Ensure the file exists in the backend directory

**Problem:** Gemini API not working
**Solution:** 
- Check if GEMINI_API_KEY environment variable is set
- Verify the API key is valid
- Check your Google Cloud quota

### Frontend Issues

**Problem:** Cannot connect to backend
**Solution:** 
- Ensure Flask backend is running on port 5000
- Check CORS is enabled in Flask
- Verify BACKEND_URL in `api-keys.ts`

**Problem:** Voice input not working
**Solution:** 
- Use Chrome or Edge browser (best support)
- Allow microphone permissions
- Check browser console for errors

**Problem:** Chatbot not opening
**Solution:**
- Check browser console for errors
- Ensure SimpleChatbot is imported correctly
- Clear browser cache and reload

---

## Key Changes Made

### Frontend Transformations

1. **App Name**: Changed from INGRES to YURUS
2. **Dashboard Widgets**: 
   - Annual Recharge → Complaints Submitted (3)
   - Assessment Units → Complaints Pending (1)
   - Extractable Resources → Complaints Solved (2)
   - Total Extraction → Complaints Rejected (0)
3. **Table**: Replaced groundwater data with complaint data
4. **Chatbot**: Simplified from complex Spring Boot integration to Flask-based IPC mapper

### Backend Transformations

1. **Framework**: Changed from Spring Boot to Flask
2. **Functionality**: 
   - IPC section matching using sentence transformers
   - Gemini API integration for general chat
   - No database dependency
3. **API**: RESTful endpoints for IPC finder and general chat

---

## Features

### ✅ Implemented
- IPC section finder using AI
- General chat with Gemini
- Voice input (English)
- Text input
- Mode switching (IPC/General)
- Simplified UI without chat history
- Complaint data table
- Static complaint statistics

### ❌ Removed
- Chat history (no database)
- Complex Spring Boot backend
- Water management features
- State filtering
- Data visualizations
- Multi-language support (simplified to English)

---

## Notes

- The IPC finder uses a similarity threshold of 0.3
- Voice input only supports English
- No chat history is saved (stateless)
- Gemini API key is required for general chat mode
- Backend must be running for chatbot to work

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Ensure all dependencies are installed
5. Verify API keys are correctly configured

---

## License

MIT License - Feel free to modify and use for your project.
