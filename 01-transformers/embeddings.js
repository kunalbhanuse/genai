import "dotenv/config";
import OpenAI from "openai";

const cleint = new OpenAI();

const embedding = await cleint.embeddings.create({
  model: "text-embedding-3-small",
  input: "Hi this is the embeddings ",
  encoding_format: "float",
});

console.log(embedding.data[0].embedding);

// so function to get the embeddings
