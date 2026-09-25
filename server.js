import app from './app.js';
import connectDB from './config/db.js';
import searchRoutes from './routes/searchRoutes.js'


const port = process.env.PORT || 3000

app.use('/api/search', searchRoutes)

const startServer = async () => {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

startServer()