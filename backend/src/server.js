const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const requirementRoutes = require('./routes/requirementRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())

// simple health check — useful for verifying Render/Railway deploys
const healthCheck = (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
}
app.get('/health', healthCheck)
app.get('/api/health', healthCheck)

// mounting routes under both /api/requirements and /requirements
// so it works regardless of how NEXT_PUBLIC_API_URL is set on Vercel
app.use('/api/requirements', requirementRoutes)
app.use('/requirements', requirementRoutes)

// catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
