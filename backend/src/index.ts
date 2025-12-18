// Load environment variables FIRST (before any imports that might need them)
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import connectDB from './config/database'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'
import { setupSwagger } from './swagger'

const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger API docs
setupSwagger(app)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api', routes)

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB()

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

