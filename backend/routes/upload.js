import multer from 'multer'
import { supabase } from '../services/supabaseClient.js'

// Configure multer for memory storage
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

export async function uploadHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

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
}

export default upload
