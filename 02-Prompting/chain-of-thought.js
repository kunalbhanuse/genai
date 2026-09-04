import "dotenv/config";
import OpenAi from "openai";

const client = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

// multi-step word problem — easy to get wrong by pattern-matching the wrong numbers
const problem =
  "A store had 140 apples. It sold 77% of them in the morning, then sold 18 more in the afternoon. How many apples are left?";

async function directAnswer(prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Answer with just the final number, nothing else.\n\n${prompt}`,
      },
    ],
  });
  return res.choices[0].message.content;
}

async function chainOfThought(prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nThink step by step, then give the final number on its own line prefixed with "Answer:".`,
      },
    ],
  });
  return res.choices[0].message.content;
}

const direct = await directAnswer(problem);
const cot = await chainOfThought(problem);

console.log("Direct:\n", direct);
console.log("\nChain-of-thought:\n", cot);
