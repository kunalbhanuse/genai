import "dotenv/config";
import OpenAi from "openai";

const client = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

const zeroShotInstructions =
  " so u are a classifing engine so u can classify in the  three categories Positive , negetive ,neutral ,and output should be one word nothing else ";

async function zeroShotSentiment(prompt) {
  const sentiment = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: zeroShotInstructions + prompt }],
  });
  return sentiment.choices[0].message.content;
}

// same task as zero-shot, but with 3 labeled examples baked into the prompt
const fewShotInstructions = `You are a classifying engine. Classify reviews into exactly one of: Positive, Negative, Neutral.
Output one word, nothing else.

Review: "Best purchase I've made all year."
Sentiment: Positive

Review: "It broke after two days and support never replied."
Sentiment: Negative

Review: "It arrived on Tuesday."
Sentiment: Neutral

Review: "`;

async function fewShotSentiment(prompt) {
  const sentiment = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: fewShotInstructions + prompt + `"\nSentiment:` },
    ],
  });
  return sentiment.choices[0].message.content;
}

// mixed/ambiguous on purpose: has a complaint AND a positive resolution
const trickyReview =
  "The food was cold when it arrived, but the staff apologized and gave us a free dessert.";

const zero = await zeroShotSentiment(trickyReview);
const few = await fewShotSentiment(trickyReview);

console.log("Zero-shot:", zero);
console.log("Few-shot: ", few);
