import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv/config';
import fs from "fs";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// Text Input
async function textInput() {

  const prompt = "What is the difference between java and javascript"
  // const prompt = "Which is better - Java or C++? Overall tell me one language"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

// textInput();

// Image Input
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function OCR() {
  
    const prompt = "Get me the date, time and venue of the event";

    const img = fileToGenerativePart("./public/Images/Poster.png", "image/png");
  
    const result = await model.generateContent([prompt, img]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

// OCR();


async function pdf() {
  
  const prompt = "Generate a summary of this document";

  const pdf = fileToGenerativePart("./public/pdfs/IDS.pdf", "application/pdf");
  // const pdf = fileToGenerativePart("https://firebasestorage.googleapis.com/v0/b/student-sync-nie.appspot.com/o/navaneethjainsl%2FIDS.pdf?alt=media&token=9264d4a0-d41b-4bd5-8942-2e4f841dd947", "application/pdf");

  const result = await model.generateContent([prompt, pdf]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

// pdf();


// Quora
async function quora() {
  
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, I have 2 dogs in my house." }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
  
    const msg = "How many paws are in my house?";
  
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

// quora();

async function fastResponse() {
  const prompt = "Give me the description of this person?";
  const img = fileToGenerativePart("./public/Images/PM.jpg", "image/png");
  const result = await model.generateContentStream([prompt, img]);

  let text = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
    text += chunkText;
  }
}

// fastResponse();