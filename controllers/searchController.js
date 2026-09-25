import qdrantClient from '../config/qdrant.js'
import { generateEmbedding } from '../services/embeddingService.js'

const COLLECTION_NAME = 'document_chunks'

const searchDocuments = async (req, res) => {
  try {
    const { query, limit = 5, documentId } = req.body

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      })
    }

    const embedding = await generateEmbedding(query)

    const searchOptions = {
      query: embedding,
      limit: Number(limit),
      with_payload: true,
    }

    // Filter by document when documentId is provided
    if (documentId) {
      searchOptions.filter = {
        must: [
          {
            key: 'documentId',
            match: {
              value: String(documentId),
            },
          },
        ],
      }
    }

    const results = await qdrantClient.query(
      COLLECTION_NAME,
      searchOptions
    )

    return res.json({
      success: true,
      query,
      documentId: documentId || null,
      results: results.points,
    })
  } catch (error) {
    console.error('Search error:', error)

    console.error(
      'Qdrant error:',
      error?.response?.data || error?.data || error
    )

    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    })
  }
}

export default searchDocuments