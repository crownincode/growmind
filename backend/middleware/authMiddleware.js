import jwt from 'jsonwebtoken'

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Get the JWT secret from Supabase (service role key is used to verify)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.SUPABASE_URL
    
    if (!supabaseKey) {
      return res.status(500).json({ error: 'Server configuration error' })
    }
    
    // Verify the JWT token
    const decoded = jwt.verify(token, supabaseKey, {
      issuer: supabaseUrl
    })
    
    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      aud: decoded.aud
    }
    
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    console.error('Auth middleware error:', error)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}
