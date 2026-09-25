import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

import uploadDocument from '../controllers/documentController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Upload folder
const uploadPath = path.join(__dirname, '../uploads')

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(null, uniqueName + path.extname(file.originalname))
  },
})

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'), false)
  }
}

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
})

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  uploadDocument
)

export default router