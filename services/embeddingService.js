import { pipeline } from "@huggingface/transformers";

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    console.log("Loading embedding model...");

    extractor = await pipeline(
      "feature-extraction",
      "onnx-community/all-MiniLM-L6-v2-ONNX"
    );

    console.log("Embedding model loaded!");
  }

  return extractor;
};

export const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate an embedding");
  }

  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};