const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorHandler')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://googlekeep-frontend.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))

// MongoDB Connection
const mongodb_uri = process.env.URI

mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.log('✓ Database connected')
  })
  .catch((err) => {
    console.error('✗ Database connection error:', err.message)
    process.exit(1)
  })

// Routes
const authRoutes = require('./routes/authRoutes')
const notesRoutes = require('./routes/notesRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/notes', notesRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Google Keep API is running',
    version: '1.0.0',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`)
})

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('✗ Unhandled Rejection:', err)
  process.exit(1)
})