import Document from '../models/Document.js'
import DocumentChunk from '../models/DocumentChunk.js'
import extractDocxText from '../utils/documentExtractor.js'
import chunkText from '../utils/textChunker.js'

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const userId = req.user.userId

    // 1. Create document record
    const document = await Document.create({
      owner: userId,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      status: 'processing',
      pageCount: 0,
    })

    // 2. Extract text
    let extractedText = ''

    if (
      req.file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      extractedText = await extractDocxText(req.file.path)
    }

    // 3. Create chunks
    const chunks = chunkText(extractedText, 500, 50)

    // 4. Save chunks in MongoDB
    const chunkDocuments = chunks.map((content, index) => ({
      document: document._id,
      owner: userId,
      content,
      chunkIndex: index,
    }))

    if (chunkDocuments.length > 0) {
      await DocumentChunk.insertMany(chunkDocuments)
    }

    // 5. Save extracted text and update status
    document.content = extractedText
    document.status = 'ready'

    await document.save()

    res.status(201).json({
      success: true,
      message: 'File uploaded, extracted, and chunked successfully',
      document: {
        id: document._id,
        owner: document.owner,
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
    })
  } catch (error) {
    console.error('Upload error:', error)

    res.status(500).json({
      success: false,
      message: 'Document processing failed',
      error: error.message,
    })
  }
}

export default uploadDocument