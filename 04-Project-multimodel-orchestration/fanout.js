import "dotenv/config";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

const aiOpenai = new OpenAI();
const aiClaude = new Anthropic();
const aiGemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function geminiCall(prompt) {
  const response = await aiGemini.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });
  console.log("Gemini :-", response.text);
}

async function claudeCall(prompt) {
  const response = await aiClaude.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  console.log("Claude:-", response.content[0].text);
}

async function openAiCall(prompt) {
  const result = await aiOpenai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });
  console.log("OpenAI:-", result.output_text);
}

async function main(params) {
  (await geminiCall(params), await claudeCall(params));
  await openAiCall(params);
}
main("hi, how are u! what i can help  ");
