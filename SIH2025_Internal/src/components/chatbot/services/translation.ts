// Enhanced Translation service for Indian Regional Languages
export interface TranslationService {
  translateText(text: string, fromLang: string, toLang: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
}

// Enhanced Indian Language code mapping
const INDIAN_LANGUAGE_CODES: Record<string, string> = {
  'en-US': 'en',
  'hi-IN': 'hi',
  'ta-IN': 'ta',
  'te-IN': 'te',
  'ml-IN': 'ml',
  'kn-IN': 'kn',
  'gu-IN': 'gu',
  'mr-IN': 'mr',
  'bn-IN': 'bn',
  'pa-IN': 'pa',
  'or-IN': 'or',
  'as-IN': 'as',
  'ur-IN': 'ur'
};

// Enhanced opening message translations for all supported languages
const OPENING_MESSAGE_TRANSLATIONS: Record<string, string> = {
  'hi-IN': 'INGRES चैटबॉट में आपका स्वागत है! आज मैं आपकी कैसे सहायता कर सकता हूं?',
  'ta-IN': 'INGRES சாட்பாட் இல் உங்களை வரவேற்கிறோம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
  'te-IN': 'కు స్వాగతం! ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
  'ml-IN': 'ലേക്ക് സ്വാഗതം! ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?',
  'kn-IN': 'INGRES ಚಾಟ್‌ಬಾಟ್ ಗೆ ಸ್ವಾಗತ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
  'gu-IN': 'INGRES ચેટબોટ માં આપનું સ્વાગત છે! આજે હું તમારી કેવી રીતે મદદ કરી શકું?',
  'mr-IN': 'INGRES चॅटबॉट मध्ये आपले स्वागत आहे! आज मी तुम्हाला कशी मदत करू शकतो?',
  'bn-IN': 'INGRES Chatbot এ আপনাকে স্বাগতম! আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
  'pa-IN': 'INGRES Chatbot ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
  'or-IN': 'INGRES Chatbot ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
  'as-IN': 'INGRES Chatbot লৈ আপোনাক স্বাগতম! আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?',
  'ur-IN': 'INGRES Chatbot میں آپ کا خوش آمدید! آج میں آپ کی کیسے مدد کر سکتا ہوں؟'
};

// Common response translations for better user experience
const COMMON_RESPONSE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'AI is thinking...': {
    'hi-IN': 'AI सोच रहा है...',
    'ta-IN': 'AI யோசித்துக் கொண்டிருக்கிறது...',
    'te-IN': 'AI ఆలోచిస్తోంది...',
    'ml-IN': 'AI ചിന്തിക്കുന്നു...',
    'kn-IN': 'AI ಯೋಚಿಸುತ್ತಿದೆ...',
    'gu-IN': 'AI વિચારી રહ્યું છે...',
    'mr-IN': 'AI विचार करत आहे...',
    'bn-IN': 'AI ভাবছে...',
    'pa-IN': 'AI ਸੋਚ ਰਿਹਾ ਹੈ...',
    'or-IN': 'AI ଚିନ୍ତା କରୁଛି...',
    'as-IN': 'AI চিন্তা কৰি আছে...',
    'ur-IN': 'AI سوچ رہا ہے...'
  },
  'Type your message...': {
    'hi-IN': 'अपना संदेश टाइप करें...',
    'ta-IN': 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
    'te-IN': 'మీ సందేశాన్ని టైప్ చేయండి...',
    'ml-IN': 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...',
    'kn-IN': 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    'gu-IN': 'તમારો સંદેશો ટાઈપ કરો...',
    'mr-IN': 'तुमचा संदेश टाइप करा...',
    'bn-IN': 'আপনার বার্তা টাইপ করুন...',
    'pa-IN': 'ਆਪਣਾ ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ...',
    'or-IN': 'ଆପଣଙ୍କର ସନ୍ଦେଶ ଟାଇପ୍ କରନ୍ତୁ...',
    'as-IN': 'আপোনাৰ বাৰ্তা টাইপ কৰক...',
    'ur-IN': 'اپنا پیغام ٹائپ کریں...'
  }
};

// Enhanced translation service with multiple fallback mechanisms
class EnhancedTranslationService implements TranslationService {
  private cache = new Map<string, string>();
  
  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    // If source and target are the same, return original text
    if (fromLang === toLang) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}|${fromLang}|${toLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Special case for opening message
    if (text === 'Welcome to the INGRES Chatbot! How can I help you today?' && toLang !== 'en-US') {
      const translation = OPENING_MESSAGE_TRANSLATIONS[toLang] || text;
      this.cache.set(cacheKey, translation);
      return translation;
    }

    // Special case for common UI text
    if (COMMON_RESPONSE_TRANSLATIONS[text] && toLang !== 'en-US') {
      const translation = COMMON_RESPONSE_TRANSLATIONS[text][toLang] || text;
      this.cache.set(cacheKey, translation);
      return translation;
    }

    // For ALL other text, use multiple translation APIs with fallback
    try {
      const sourceCode = INDIAN_LANGUAGE_CODES[fromLang] || 'en';
      const targetCode = INDIAN_LANGUAGE_CODES[toLang] || 'hi';

      console.log(`🔄 Translating from ${sourceCode} to ${targetCode}: "${text}"`);

      // Primary: Try Google Translate API
      const translation = await this.tryGoogleTranslate(text, sourceCode, targetCode);
      if (translation && translation !== text) {
        this.cache.set(cacheKey, translation);
        console.log(`✅ Translation successful: "${translation}"`);
        return translation;
      }

      // Fallback: Try Microsoft Translator (if Google fails)
      const msTranslation = await this.tryMicrosoftTranslate(text, sourceCode, targetCode);
      if (msTranslation && msTranslation !== text) {
        this.cache.set(cacheKey, msTranslation);
        console.log(`✅ Microsoft translation successful: "${msTranslation}"`);
        return msTranslation;
      }

      // If all translation services fail, return original text
      console.log(`⚠️ Translation failed, returning original text`);
      return text;

    } catch (error) {
      console.error('❌ Translation error:', error);
      return text;
    }
  }

  private async tryGoogleTranslate(text: string, sourceCode: string, targetCode: string): Promise<string | null> {
    try {
      // Using Google Translate's free API
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Google Translate API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
      
      return null;
    } catch (error) {
      console.error('Google Translate error:', error);
      return null;
    }
  }

  private async tryMicrosoftTranslate(text: string, sourceCode: string, targetCode: string): Promise<string | null> {
    try {
      // Alternative: Try Bing Translator (free tier)
      const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceCode}&to=${targetCode}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ Text: text }])
      });
      
      if (!response.ok) {
        throw new Error(`Microsoft Translator API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data[0] && data[0].translations && data[0].translations[0]) {
        return data[0].translations[0].text;
      }
      
      return null;
    } catch (error) {
      console.error('Microsoft Translate error:', error);
      return null;
    }
  }

  async detectLanguage(text: string): Promise<string> {
    // Enhanced language detection based on character patterns for Indian languages
    if (/[अ-ह]/.test(text)) return 'hi-IN';
    if (/[அ-ஹ]/.test(text)) return 'ta-IN';
    if (/[అ-హ]/.test(text)) return 'te-IN';
    if (/[അ-ഹ]/.test(text)) return 'ml-IN';
    if (/[ಅ-ಹ]/.test(text)) return 'kn-IN';
    if (/[અ-હ]/.test(text)) return 'gu-IN';
    if (/[अ-ह]/.test(text)) return 'mr-IN';
    if (/[অ-হ]/.test(text)) return 'bn-IN';
    if (/[ਅ-ਹ]/.test(text)) return 'pa-IN';
    if (/[ଅ-ହ]/.test(text)) return 'or-IN';
    if (/[অ-হ]/.test(text)) return 'as-IN';
    if (/[ا-ی]/.test(text)) return 'ur-IN';
    return 'en-US';
  }

  // Method to clear cache if needed
  clearCache() {
    this.cache.clear();
  }

  // Method to get cache size for debugging
  getCacheSize() {
    return this.cache.size;
  }
}

// Export the enhanced translation service instance
export const translationService: TranslationService = new EnhancedTranslationService();

// Utility function to get language name from code
export const getLanguageName = (langCode: string): string => {
  const names: Record<string, string> = {
    'en-US': 'English',
    'hi-IN': 'हिंदी',
    'ta-IN': 'தமிழ்',
    'te-IN': 'తెలుగు',
    'ml-IN': 'മലയാളം',
    'kn-IN': 'ಕನ್ನಡ',
    'gu-IN': 'ગુજરાતી',
    'mr-IN': 'मराठी',
    'bn-IN': 'বাংলা',
    'pa-IN': 'ਪੰਜਾਬੀ',
    'or-IN': 'ଓଡ଼ିଆ',
    'as-IN': 'অসমীয়া',
    'ur-IN': 'اردو'
  };
  return names[langCode] || langCode;
};

// Helper function to translate common UI text
export const translateUIText = async (text: string, toLang: string): Promise<string> => {
  if (toLang === 'en-US') return text;
  
  if (COMMON_RESPONSE_TRANSLATIONS[text] && COMMON_RESPONSE_TRANSLATIONS[text][toLang]) {
    return COMMON_RESPONSE_TRANSLATIONS[text][toLang];
  }
  
  return translationService.translateText(text, 'en-US', toLang);
};