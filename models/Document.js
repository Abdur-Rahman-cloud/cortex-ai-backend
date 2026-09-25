import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },

    pageCount: {
      type: Number,
      default: 0,
    },

    content: {
    type: String,
    default: '',
   },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
  
)

const Document = mongoose.model('Document', documentSchema)

export default Document