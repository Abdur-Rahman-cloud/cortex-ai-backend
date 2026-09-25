import express from 'express'
import searchDocuments from '../controllers/searchController.js'

const router = express.Router()

router.post('/', searchDocuments)

export default router