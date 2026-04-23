import fs from 'node:fs/promises';
import path from 'node:path';

const API_URL = "http://localhost:5007/api/growth-stage";

async function verifyImage(filename: string) {
  console.log(`\n🔍 Verifying: ${filename}...`);
  
  try {
    const filePath = path.join(process.cwd(), '..', filename);
    const buffer = await fs.readFile(filePath);
    
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('image', blob, filename);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      console.error(`❌ Failed: ${filename}`, err);
      return;
    }

    const data = await response.json();
    console.log(`✅ Success: ${filename}`);
    console.log(`   Stage: ${data.stage}`);
    console.log(`   Confidence: ${data.confidence}%`);
    console.log(`   Recommendation: ${data.recommendation}`);
  } catch (error: any) {
    console.error(`💥 Error processing ${filename}:`, error.message);
  }
}

async function run() {
  console.log("🚀 Starting AI Growth Stage Verification Service...");
  await verifyImage('green_test.jpg');
  await verifyImage('pink_test.jpg');
  console.log("\n✨ Verification Complete.");
}

run();
