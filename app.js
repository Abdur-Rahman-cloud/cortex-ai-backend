import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/healthRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js';

const app = express()

app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use('/api', healthRoutes)

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/login', (req, res) => {
  res.send('<h1> Please login at Awkum </h1>')
})

// app.get('/api/test-error', (req, res, next) => {
//   const error = new Error('This is a test error')
//   error.statusCode = 500
//   next(error)
// })

app.use(errorHandler)

export default app
