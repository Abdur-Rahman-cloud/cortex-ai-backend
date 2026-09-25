import { randomUUID } from 'crypto'
import qdrantClient from '../config/qdrant.js'
import { generateEmbedding } from './embeddingService.js'

const COLLECTION_NAME = 'document_chunks'

export const storeChunkEmbedding = async (chunk) => {
  const embedding = await generateEmbedding(chunk.text)

  const vectorId = randomUUID()

  await qdrantClient.upsert(COLLECTION_NAME, {
    points: [
      {
        id: vectorId,
        vector: embedding,
        payload: {
          documentId: chunk.document.toString(),
          chunkId: chunk._id.toString(),
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
        },
      },
    ],
  })

  return {
    vectorId,
    embedding,
  }
}