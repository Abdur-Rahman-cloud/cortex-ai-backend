import Document from '../models/Document.js'
import Chunk from '../models/Chunk.js'
import extractDocxText from '../utils/documentExtractor.js'
import chunkText from '../utils/textChunker.js'
import { storeChunkEmbedding } from '../services/vectorService.js'
import fs from 'fs/promises'

const uploadDocument = async (req, res) => {
  let document = null

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const userId = req.user.userId

    // 1. Create document record
    document = await Document.create({
      owner: userId,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      status: 'processing',
      pageCount: 0,
    })

    // 2. Extract text
    let extractedText = ''

    if (req.file.mimetype === 'text/plain') {
      extractedText = await fs.readFile(req.file.path, 'utf-8')
    } else if (req.file.mimetype === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default
      const buffer = await fs.readFile(req.file.path)
      const pdfData = await pdfParse(buffer)

      extractedText = pdfData.text
      document.pageCount = pdfData.numpages
    } else if (
      req.file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      extractedText = await extractDocxText(req.file.path)
    }

    if (!extractedText.trim()) {
      throw new Error('No text could be extracted from the document')
    }

    // 3. Create overlapping chunks
    const chunks = chunkText(extractedText, 500, 50)

    if (chunks.length === 0) {
      throw new Error('No chunks were created from the document')
    }

    // 4. Save chunks and generate embeddings
    for (let index = 0; index < chunks.length; index++) {
      const chunk = await Chunk.create({
        document: document._id,
        chunkIndex: index,
        text: chunks[index],
        tokenCount: chunks[index].split(/\s+/).length,
        embeddingStatus: 'processing',
      })

      try {
        const result = await storeChunkEmbedding(chunk)

        chunk.vectorId = result.vectorId
        chunk.embeddingStatus = 'ready'

        await chunk.save()
      } catch (embeddingError) {
        console.error(
          `Embedding failed for chunk ${index}:`,
          embeddingError.message
        )

        chunk.embeddingStatus = 'failed'
        chunk.embeddingAttempts += 1

        await chunk.save()

        throw embeddingError
      }
    }

    // 5. Save extracted text
    document.content = extractedText
    document.status = 'ready'

    await document.save()

    // 6. Delete uploaded file after processing
    await fs.unlink(req.file.path).catch(() => {})

    return res.status(201).json({
      success: true,
      message: 'Document processed successfully',
      document: {
        id: document._id,
        filename: document.filename,
        fileType: document.fileType,
        status: document.status,
        pageCount: document.pageCount,
        uploadedAt: document.uploadedAt,
      },
      chunks: {
        total: chunks.length,
        size: 500,
        overlap: 50,
      },
      embeddings: {
        dimension: 384,
        status: 'ready',
        vectorDatabase: 'Qdrant',
      },
    })
  } catch (error) {
    console.error('Upload error:', error)

    if (document) {
      document.status = 'failed'
      await document.save().catch(() => {})
    }

    return res.status(500).json({
      success: false,
      message: 'Document processing failed',
      error: error.message,
    })
  }
}

export default uploadDocument