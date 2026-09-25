import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    tokenCount: {
      type: Number,
      required: true,
    },

    vectorId: {
      type: String,
      default: null,
    },

    embeddingStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },

    embeddingAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate chunk indexes within the same document
chunkSchema.index(
  { document: 1, chunkIndex: 1 },
  { unique: true }
);

const Chunk = mongoose.model("Chunk", chunkSchema);

export default Chunk;