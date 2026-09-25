import "dotenv/config";
import { generateEmbedding } from "./services/embeddingService.js";

const test = async () => {
  try {
    const text = "This is a test document for semantic search.";

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully!");
    console.log("Vector length:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Embedding test failed:");
    console.error(error.message);
  }
};

test();