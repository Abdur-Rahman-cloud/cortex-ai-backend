## WEEK-1
 Cortex AI Backend
Backend project developed for Zyroo Internship

# Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

## Installation
npm install

## Run
npm run dev

## Health Check
GET /api/health



# WEEK-2
 Cortex AI Backend

Backend API for the Cortex AI project built with Node.js, Express, MongoDB, and JWT authentication.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Token (JWT)
- dotenv
- Postman

## Setup

1. Clone the repository.
2. Install dependencies:

npm install




# WEEK-3 & WEEK-4

Cortex AI Backend

Document Processing & Semantic Search backend developed for Zyroo Internship.

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* PDF-Parse
* Mammoth
* Hugging Face Transformers.js
* all-MiniLM-L6-v2
* Qdrant Cloud
* JWT Authentication
* dotenv
* Postman

## Document Processing

The backend supports:

* PDF file upload
* DOCX file upload
* TXT file upload
* File type validation
* File size validation
* Text extraction
* Text chunking
* 500-token chunks
* 50-token overlap
* Chunk storage in MongoDB

## Embeddings

The project uses a local Hugging Face embedding model:

`all-MiniLM-L6-v2`

Each document chunk is converted into a **384-dimensional vector**.

Embeddings are generated locally, so an OpenAI API key is not required for the embedding process.

## Vector Database

Qdrant Cloud is used for vector storage.

Collection:

`document_chunks`

Distance metric:

`Cosine`

Each stored vector contains metadata including:

* Document ID
* Chunk ID
* Chunk index
* Chunk text

## Document API

### Upload Document

http  POST /api/documents

Supports:

* PDF
* DOCX
* TXT

### List Documents

http  GET /api/documents


### Get Document

http  GET /api/documents/:id

### Delete Document

http  DELETE /api/documents/:id

## Semantic Search

The backend provides semantic search by:

1. Converting the search query into an embedding.
2. Searching Qdrant using cosine similarity.
3. Returning the most relevant document chunks.
4. Supporting document-specific filtering.

### Search Endpoint

http POST /api/search

## Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=
JWT_SECRET=

QDRANT_URL=
QDRANT_API_KEY=


## Installation

bash
npm install


## Run

bash
npm run dev

## Project Flow

```text
Document Upload
       ↓
File Validation
       ↓
Text Extraction
       ↓
Text Chunking
       ↓
MongoDB
       ↓
Local Embedding Model
       ↓
384-Dimensional Vector
       ↓
Qdrant Cloud
       ↓
Semantic Search
```
