import "dotenv/config";

import OpenAI from "openai";

const client = new OpenAI();

async function init() {
  const result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Hey there My name is kunal bhanuse!",
  });
  console.log("Res:-", result);
}

init();
