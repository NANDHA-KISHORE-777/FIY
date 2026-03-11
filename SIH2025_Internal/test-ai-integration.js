// Simple test script to verify AI integration
console.log("🧪 Testing INGRES AI Integration...");

// Test 1: Check if files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/components/chatbot/services/config.ts',
  'src/components/chatbot/services/ai/ai-query-service.ts',
  'src/components/chatbot/services/ai/index.ts',
  'src/components/chatbot/services/query-processor.ts',
  'src/components/chatbot/services/index.ts'
];

console.log("\n📁 Checking required files:");
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 2: Check if services can be imported (syntax check)
console.log("\n📦 Checking TypeScript syntax:");
const { execSync } = require('child_process');

try {
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
  console.log("✅ TypeScript compilation successful");
} catch (error) {
  console.log("❌ TypeScript compilation errors found");
  console.log(error.stdout.toString());
}

console.log("\n🎉 AI Integration Test Complete!");
console.log("\n📋 Next Steps:");
console.log("1. Get your free Gemini API key from: https://aistudio.google.com/app/apikey");
console.log("2. Replace 'YOUR_GEMINI_API_KEY_HERE' in src/components/chatbot/services/config.ts");
console.log("3. Start the dev server: npm run dev");
console.log("4. Test queries like: 'Show me water levels in Tamil Nadu'");
