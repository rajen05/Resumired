// Test Gemini API connection
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
    console.log('Testing Gemini API...');
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent('Say "Hello, API works!"');
        const response = await result.response;
        console.log('SUCCESS! Response:', response.text());
    } catch (error) {
        console.log('FAILED! Error:', error.message);
        if (error.errorDetails) {
            console.log('Details:', JSON.stringify(error.errorDetails, null, 2));
        }
    }
}

testGemini();
