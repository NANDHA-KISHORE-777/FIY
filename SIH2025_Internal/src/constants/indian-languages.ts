// Complete list of Indian languages supported by Edge TTS with recommended female voices

export const INDIAN_LANGUAGES_EDGE_TTS = {
  // Hindi
  'hi-IN': {
    name: 'Hindi (India)',
    nativeName: 'हिन्दी',
    femaleVoices: [
      'hi-IN-SwaraNeural',     // Primary recommendation - natural female voice
      'hi-IN-MadhurNeural',    // Alternative female voice
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Bengali 
  'bn-IN': {
    name: 'Bengali (India)',
    nativeName: 'বাংলা',
    femaleVoices: [
      'bn-IN-TanishaaNeural',  // Primary recommendation
    ],
    maleVoices: ['bn-IN-BashkarNeural']
  },

  // Tamil
  'ta-IN': {
    name: 'Tamil (India)', 
    nativeName: 'தமிழ்',
    femaleVoices: [
      'ta-IN-PallaviNeural',   // Primary recommendation
    ],
    maleVoices: ['ta-IN-ValluvarNeural']
  },

  // Telugu
  'te-IN': {
    name: 'Telugu (India)',
    nativeName: 'తెలుగు', 
    femaleVoices: [
      'te-IN-ShrutiNeural',    // Primary recommendation
    ],
    maleVoices: ['te-IN-MohanNeural']
  },

  // Marathi
  'mr-IN': {
    name: 'Marathi (India)',
    nativeName: 'मराठी',
    femaleVoices: [
      'mr-IN-AarohiNeural',    // Primary recommendation
    ],
    maleVoices: ['mr-IN-ManoharNeural']
  },

  // Gujarati  
  'gu-IN': {
    name: 'Gujarati (India)',
    nativeName: 'ગુજરાતી',
    femaleVoices: [
      'gu-IN-DhwaniNeural',    // Primary recommendation  
    ],
    maleVoices: ['gu-IN-NiranjanNeural']
  },

  // Kannada
  'kn-IN': {
    name: 'Kannada (India)',
    nativeName: 'ಕನ್ನಡ',
    femaleVoices: [
      'kn-IN-SapnaNeural',     // Primary recommendation
    ],
    maleVoices: ['kn-IN-GaganNeural']
  },

  // Malayalam
  'ml-IN': {
    name: 'Malayalam (India)', 
    nativeName: 'മലയാളം',
    femaleVoices: [
      'ml-IN-SobhanaNeural',   // Primary recommendation
    ],
    maleVoices: ['ml-IN-MidhunNeural']
  },

  // Punjabi
  'pa-IN': {
    name: 'Punjabi (India)',
    nativeName: 'ਪੰਜਾਬੀ',
    femaleVoices: [
      'pa-IN-BaniNeural',      // Primary recommendation
    ],
    maleVoices: ['pa-IN-GulNeural']
  },

  // Odia/Oriya  
  'or-IN': {
    name: 'Odia (India)',
    nativeName: 'ଓଡ଼ିଆ',
    femaleVoices: [
      'or-IN-SubhasiniNeural', // Primary recommendation
    ],
    maleVoices: ['or-IN-SukantNeural']
  },

  // Assamese
  'as-IN': {
    name: 'Assamese (India)',
    nativeName: 'অসমীয়া', 
    femaleVoices: [
      'as-IN-YashodaNeural',   // Primary recommendation
    ],
    maleVoices: ['as-IN-RanjitNeural']
  },

  // Urdu
  'ur-IN': {
    name: 'Urdu (India)',
    nativeName: 'اردو',
    femaleVoices: [
      'ur-IN-GulNeural',       // Primary recommendation
    ],
    maleVoices: ['ur-IN-SalmanNeural']
  },

  // Nepali (also used in some Indian regions)
  'ne-NP': {
    name: 'Nepali',
    nativeName: 'नेपाली',
    femaleVoices: [
      'ne-NP-HemkalaNeural',   // Primary recommendation
    ],
    maleVoices: ['ne-NP-SagarNeural']
  },

  // Sanskrit (classical Indian language)
  'sa-IN': {
    name: 'Sanskrit (India)',
    nativeName: 'संस्कृतम्',
    femaleVoices: [
      // Note: Sanskrit may not have dedicated neural voices in Edge TTS
      // Will fallback to Hindi female voice
      'hi-IN-SwaraNeural',
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // English (Indian accent)
  'en-IN': {
    name: 'English (India)',
    nativeName: 'English',
    femaleVoices: [
      'en-IN-NeerjaNeural',    // Primary recommendation - Indian female accent
      'en-IN-PrabhatNeural',   // Alternative
    ],
    maleVoices: ['en-IN-PrabhatNeural']
  },

  // Sindhi
  'sd-IN': {
    name: 'Sindhi (India)',
    nativeName: 'سنڌي', 
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Konkani
  'gom-IN': {
    name: 'Konkani (India)',
    nativeName: 'कोंकणी',
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Manipuri
  'mni-IN': {
    name: 'Manipuri (India)',
    nativeName: 'ꯃꯅꯤꯄꯨꯔꯤ',
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Bodo
  'brx-IN': {
    name: 'Bodo (India)', 
    nativeName: 'बोडो',
    femaleVoices: [
      'as-IN-YashodaNeural', // Fallback to Assamese (related)
    ],
    maleVoices: ['as-IN-RanjitNeural']
  },

  // Santali
  'sat-IN': {
    name: 'Santali (India)',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Kashmiri
  'ks-IN': {
    name: 'Kashmiri (India)',
    nativeName: 'کٲشُر',
    femaleVoices: [
      'ur-IN-GulNeural', // Fallback to Urdu (related script)
    ],
    maleVoices: ['ur-IN-SalmanNeural']
  },

  // Dogri
  'doi-IN': {
    name: 'Dogri (India)',
    nativeName: 'डोगरी',
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  },

  // Maithili
  'mai-IN': {
    name: 'Maithili (India)',
    nativeName: 'मैथिली',
    femaleVoices: [
      'hi-IN-SwaraNeural', // Fallback to Hindi
    ],
    maleVoices: ['hi-IN-MadhurNeural']
  }
};

// Helper function to get the best female voice for a language
export function getBestFemaleVoice(languageCode: string): string {
  const language = INDIAN_LANGUAGES_EDGE_TTS[languageCode as keyof typeof INDIAN_LANGUAGES_EDGE_TTS];
  
  if (language && language.femaleVoices.length > 0) {
    return language.femaleVoices[0]; // Return the primary recommendation
  }
  
  // Fallback to English Indian female voice
  return 'en-IN-NeerjaNeural';
}

// Get all supported language codes
export function getSupportedLanguageCodes(): string[] {
  return Object.keys(INDIAN_LANGUAGES_EDGE_TTS);
}

// Get language display options for dropdown
export function getLanguageDropdownOptions() {
  return Object.entries(INDIAN_LANGUAGES_EDGE_TTS).map(([code, info]) => ({
    value: code,
    label: `${info.nativeName} (${info.name})`,
    nativeName: info.nativeName,
    englishName: info.name
  }));
}

// Get most commonly used languages for primary display
export function getPrimaryLanguages() {
  const primaryCodes = ['hi-IN', 'en-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'];
  return primaryCodes.map(code => ({
    value: code,
    label: INDIAN_LANGUAGES_EDGE_TTS[code as keyof typeof INDIAN_LANGUAGES_EDGE_TTS].nativeName,
    nativeName: INDIAN_LANGUAGES_EDGE_TTS[code as keyof typeof INDIAN_LANGUAGES_EDGE_TTS].nativeName,
    englishName: INDIAN_LANGUAGES_EDGE_TTS[code as keyof typeof INDIAN_LANGUAGES_EDGE_TTS].name
  }));
}