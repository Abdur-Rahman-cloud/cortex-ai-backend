import "dotenv/config";
import mongoose from "mongoose";
import Chunk from "./models/Chunk.js";
import { storeChunkEmbedding } from "./services/vectorService.js";

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const chunk = await Chunk.findOne();

    if (!chunk) {
      console.log("No chunks found in MongoDB.");
      console.log("We need to upload/process a document first.");
      process.exit(0);
    }

    console.log("Testing chunk:", chunk._id.toString());

    const result = await storeChunkEmbedding(chunk);

    chunk.vectorId = result.vectorId;
    chunk.embeddingStatus = "ready";
    await chunk.save();

    console.log("Embedding stored in Qdrant!");
    console.log("Vector ID:", result.vectorId);
    console.log("Vector length:", result.embedding.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Vector test failed:");
    console.error(error.message);
  }
};

test();