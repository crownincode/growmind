import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { testConnection } from './services/supabaseClient.js'
import plantsRouter from './routes/plants.js'
import remindersRouter from './routes/reminders.js'
import uploadRouter from './routes/upload.js'
import diagnoseRouter from './routes/diagnose.js'
import careplanRouter from './routes/careplan.js'
import { authMiddleware } from './middleware/authMiddleware.js'
import reminderService from './services/reminderService.js'
import multer from 'multer'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Configure multer for memory storage (for upload route)
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handle preflight OPTIONS requests
app.options('*', cors())

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'growmind-backend'
  })
})

// Database connection test route
app.get('/api/db-test', async (req, res) => {
  const connected = await testConnection()
  if (connected) {
    res.json({ status: 'connected', message: 'Database connection successful' })
  } else {
    res.status(500).json({ status: 'error', message: 'Database connection failed' })
  }
})

// API Routes
app.use('/api/plants', plantsRouter)
app.use('/api/reminders', remindersRouter)
app.use('/api/careplan', authMiddleware, careplanRouter)

// Upload route (requires auth)
app.post('/api/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { supabase } = await import('./services/supabaseClient.js')
    
    const fileName = `${req.user.id}-${Date.now()}-${req.file.originalname}`
    const filePath = `plant-images/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('plant-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('plant-images')
      .getPublicUrl(filePath)

    res.json({ 
      success: true, 
      imageUrl: urlData.publicUrl,
      fileName: req.file.originalname
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

// Diagnose route
app.use('/api/diagnose', diagnoseRouter)

// Schedule reminder cron job (daily at 8am)
cron.schedule('0 8 * * *', () => {
  console.log('🌿 Running daily reminder check...')
  reminderService.sendPendingReminders()
    .then(() => console.log('✅ Reminders sent successfully'))
    .catch(err => console.error('❌ Error sending reminders:', err))
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` })
  }
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🌿 GrowMind Backend running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
  console.log(`   DB test: http://localhost:${PORT}/api/db-test`)
  console.log(`   Plants API: http://localhost:${PORT}/api/plants`)
  console.log(`   Reminders API: http://localhost:${PORT}/api/reminders`)
  console.log(`   Upload API: POST http://localhost:${PORT}/api/upload`)
  console.log(`   Diagnose API: POST http://localhost:${PORT}/api/diagnose`)
  console.log(`   Care Plan API: POST http://localhost:${PORT}/api/careplan`)
  console.log(`   Reminder cron job scheduled (daily 8am)`)
})

export default app
