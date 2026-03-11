// Configuration file for AI services
// Uses environment variables for secure API key management

export const AI_CONFIG = {
  // Get your free Gemini API key from: https://aistudio.google.com/app/apikey
  // Set VITE_GEMINI_API_KEY in your .env file
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE",
  
  // API endpoints
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  
  // Model configuration
  GEMINI_CONFIG: {
    temperature: 0.1,
    topK: 1,
    topP: 0.8,
    maxOutputTokens: 1024,
  }
};

// Validation function
export const validateApiKeys = () => {
  const missingKeys = [];
  
  if (!AI_CONFIG.GEMINI_API_KEY || AI_CONFIG.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    missingKeys.push("VITE_GEMINI_API_KEY");
  }
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};

// Helper function to check if API key is configured
export const isApiKeyConfigured = (): boolean => 
  AI_CONFIG.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE" && 
  AI_CONFIG.GEMINI_API_KEY.length > 10;

// Debug function to safely log configuration status
export const debugConfig = () => {
  console.log("🔧 AI Configuration Status:");
  console.log("- API Key configured:", isApiKeyConfigured());
  console.log("- API Key length:", AI_CONFIG.GEMINI_API_KEY?.length || 0);
  console.log("- Environment variables available:", typeof import.meta.env);
  
  const validation = validateApiKeys();
  if (!validation.isValid) {
    console.warn("⚠️ Missing API keys:", validation.missingKeys);
    console.log("💡 Add your API key to .env file: VITE_GEMINI_API_KEY=your_key_here");
  }
};
