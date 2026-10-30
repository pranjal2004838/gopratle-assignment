const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Requirement = require('../models/Requirement')

// fallback store used when mongo isn't available — helpful for local dev without a DB setup
let tempStore = []

const mongoUp = () => mongoose.connection.readyState === 1

// ─────────────────────────────────────────────
// POST /requirements  — create a new one
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const body = req.body

    // quick check on required step-1 fields before doing anything else
    if (!body.eventName || !body.eventType || !body.startDate || !body.location || !body.category) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: eventName, eventType, startDate, location, category'
      })
    }

    const allowed = ['planner', 'performer', 'crew']
    if (!allowed.includes(body.category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${allowed.join(', ')}`
      })
    }

    // build the doc - only attach the matching category details block
    // the other two (e.g. performerDetails if category is 'crew') won't be saved
    const doc = {
      eventName: body.eventName,
      eventType: body.eventType,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      isDateRange: !!body.isDateRange,
      location: body.location,
      venue: body.venue || '',
      category: body.category,
      contactInfo: body.contactInfo || {},
      status: 'open'
    }

    if (body.category === 'planner') {
      doc.plannerDetails = body.plannerDetails || {}
    } else if (body.category === 'performer') {
      doc.performerDetails = body.performerDetails || {}
    } else {
      doc.crewDetails = body.crewDetails || {}
    }

    let saved

    if (mongoUp()) {
      const req = new Requirement(doc)
      saved = await req.save()
      console.log(`Saved [${saved.category}] requirement to MongoDB: "${saved.eventName}" — ${saved._id}`)
    } else {
      // this is a bit hacky but works fine for demo/testing purposes
      saved = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      tempStore.unshift(saved)
      console.log(`Saved [${saved.category}] requirement to memory: "${saved.eventName}"`)
    }

    return res.status(201).json({
      success: true,
      message: 'Requirement posted successfully!',
      data: saved,
      storage: mongoUp() ? 'mongodb' : 'memory'
    })
  } catch (err) {
    console.error('POST /requirements error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while saving the requirement.',
      error: err.message
    })
  }
})

// ─────────────────────────────────────────────
// GET /requirements  — list all, optional filter
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query

    if (mongoUp()) {
      let filter = {}

      if (category && ['planner', 'performer', 'crew'].includes(category)) {
        filter.category = category
      }

      // simple search across event name and city
      if (search && search.trim()) {
        filter.$or = [
          { eventName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      }

      const results = await Requirement.find(filter).sort({ createdAt: -1 })

      return res.json({
        success: true,
        count: results.length,
        data: results
      })
    } else {
      // filter the in-memory array manually
      let results = [...tempStore]

      if (category && ['planner', 'performer', 'crew'].includes(category)) {
        results = results.filter(r => r.category === category)
      }

      if (search && search.trim()) {
        const q = search.toLowerCase()
        results = results.filter(r =>
          r.eventName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
        )
      }

      return res.json({
        success: true,
        count: results.length,
        data: results
      })
    }
  } catch (err) {
    console.error('GET /requirements error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to load requirements',
      error: err.message
    })
  }
})

// ─────────────────────────────────────────────
// GET /requirements/:id  — single item
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (mongoUp()) {
      const item = await Requirement.findById(id)
      if (!item) {
        return res.status(404).json({ success: false, message: 'Requirement not found' })
      }
      return res.json({ success: true, data: item })
    } else {
      const item = tempStore.find(r => r._id === id)
      if (!item) {
        return res.status(404).json({ success: false, message: 'Requirement not found' })
      }
      return res.json({ success: true, data: item })
    }
  } catch (err) {
    // usually means bad ObjectId format
    return res.status(400).json({ success: false, message: 'Invalid ID' })
  }
})

// ─────────────────────────────────────────────
// DELETE /requirements/:id  — remove one
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (mongoUp()) {
      const gone = await Requirement.findByIdAndDelete(id)
      if (!gone) {
        return res.status(404).json({ success: false, message: 'Not found' })
      }
      return res.json({ success: true, message: 'Deleted' })
    } else {
      const before = tempStore.length
      tempStore = tempStore.filter(r => r._id !== id)
      if (tempStore.length === before) {
        return res.status(404).json({ success: false, message: 'Not found' })
      }
      return res.json({ success: true, message: 'Deleted' })
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
