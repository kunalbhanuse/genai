import "dotenv/config";
import OpenAi from "openai";

// REW Featch
async function rawFeatch() {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: "give me a deadly motivation " }],
    }),
  });

  return res;
}

const ans = await rawFeatch();
const res = await ans.json();

// console.log(res);
// console.log("message: ", res.choices[0].message);

// SDK Version

const client = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

async function sdkVersion() {
  const compleition = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "give me a deadly motivation" }],
  });
  return compleition;
}

// const sdk = await sdkVersion();
// console.log(sdk.choices[0].message.content);
const instructions =
  " so u are a classifing engine so u can classify in the  three categories Positive , negetive ,neutral ,and output should be one word nothing else ";
async function sentimentReview(prompt) {
  const sentiment = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: instructions + prompt }],
  });
  return sentiment;
}

const senti = await sentimentReview("It arrived on Tuesday.");
console.log(senti.choices[0].message.content);
