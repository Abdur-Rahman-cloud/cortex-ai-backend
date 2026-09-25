import mongoose from 'mongoose'

const documentChunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const DocumentChunk = mongoose.model(
  'DocumentChunk',
  documentChunkSchema
)

export default DocumentChunk