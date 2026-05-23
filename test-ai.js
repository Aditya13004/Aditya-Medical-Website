const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Load the local database inside Node.js
const GlobalMedicineDatabase = require('./jarvis-medicine-database');

async function runTests() {
  console.log('🧪 Starting MedAssist AI & Gemini Integration Diagnostics');
  console.log('='.repeat(65));

  // Test 1: Gemini API Key Configuration Checks
  console.log('\n📋 Test 1: Gemini API Key Configuration');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not found in environment variables (.env)');
    return;
  }
  
  if (apiKey.startsWith('AIzaSy')) {
    console.log('✅ API key exists and matches Google Gemini format pattern');
    console.log(`📡 Configured Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
  } else {
    console.log('⚠️  Warning: API key is configured but does not match standard Gemini format.');
  }

  // Test 2: Local Medicine Database Health Checks
  console.log('\n📋 Test 2: Local Medicine Database Verification');
  try {
    const db = new GlobalMedicineDatabase();
    const categories = Object.keys(db.getAllDiseaseCategories());
    
    let totalMedicines = 0;
    let availableCount = 0;
    let unavailableCount = 0;

    Object.values(db.medicineDatabase).forEach(category => {
      category.medicines.forEach(med => {
        totalMedicines++;
        if (med.availability) {
          availableCount++;
        } else {
          unavailableCount++;
        }
      });
    });

    console.log(`✅ Database successfully loaded inside Node.js runtime environment`);
    console.log(`📊 Disease Categories Count: ${categories.length}`);
    console.log(`💊 Total Medicine Varieties: ${totalMedicines}`);
    console.log(`   🟢 Available (In Stock):   ${availableCount} medicines`);
    console.log(`   🔴 Unavailable (Out of Stock): ${unavailableCount} medicines`);
    console.log(`📈 Stock ratio: ${((availableCount / totalMedicines) * 100).toFixed(1)}% in stock`);
  } catch (error) {
    console.log('❌ Failed loading local medicine database:', error.message);
  }

  // Test 3: MedAssist AI Chatbot Code Integrity Checks
  console.log('\n📋 Test 3: Chatbot Code & UI Identity Integrity');
  try {
    const chatbotPath = path.join(__dirname, 'jarvis-chatbot.js');
    if (fs.existsSync(chatbotPath)) {
      const content = fs.readFileSync(chatbotPath, 'utf8');
      
      const hasOldName = content.includes('JarvisAI =') || content.includes('Jarvis AI Chatbot - ');
      const hasNewName = content.includes('MedAssist AI');
      const hasConditionalCart = content.includes('isAvailable ?') || content.includes('.jarvis-out-of-stock-badge');

      console.log('✅ Chatbot source file found');
      console.log(`🤖 Name Branding: ${hasNewName ? '✅ MedAssist AI branding is active' : '⚠️ MedAssist AI branding not found'}`);
      console.log(`🛒 Cart Availability Logic: ${hasConditionalCart ? '✅ Conditional button & out-of-stock rendering is active' : '❌ Stock check missing'}`);
    } else {
      console.log('❌ jarvis-chatbot.js file not found in root directory');
    }
  } catch (error) {
    console.log('❌ Failed analyzing chatbot file:', error.message);
  }

  // Test 4: Local Server Health Checks
  console.log('\n📋 Test 4: Local Express Server & APIs check');
  const port = process.env.PORT || 3000;
  const healthUrl = `http://localhost:${port}/api/health`;
  try {
    const response = await axios.get(healthUrl, { timeout: 3000 });
    if (response.status === 200) {
      console.log('✅ Web server is running perfectly');
      console.log(`📡 URL: http://localhost:${port}`);
      console.log(`🏥 Health Status: ${JSON.stringify(response.data)}`);
    } else {
      console.log(`⚠️  Web server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Web server is not running on port ${port} or is unreachable.`);
    console.log('💡 Note: Start the server with `npm run dev` to access the products database and place orders!');
  }

  console.log('\n' + '='.repeat(65));
  console.log('🎯 Diagnostic Verification Complete');
}

runTests();