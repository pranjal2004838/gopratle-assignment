const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Requirement = require('../models/Requirement');

// In-memory fallback store in case MongoDB is not connected yet during testing/evaluation
let memoryStore = [];

// Helper to check if real MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// POST: Create a new requirement
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // basic validation checks for step 1 fields
    if (!data.eventName || !data.eventType || !data.startDate || !data.location || !data.category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in Step 1 (eventName, eventType, startDate, location, category)'
      });
    }

    const validCategories = ['planner', 'performer', 'crew'];
    if (!validCategories.includes(data.category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be planner, performer, or crew.'
      });
    }

    // Build payload: only keep details for the chosen category
    // This directly ensures the requirement is clearly categorised under the selected type
    const payload = {
      eventName: data.eventName,
      eventType: data.eventType,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isDateRange: Boolean(data.isDateRange),
      location: data.location,
      venue: data.venue || '',
      category: data.category,
      contactInfo: data.contactInfo || {},
      status: 'open'
    };

    if (data.category === 'planner') {
      payload.plannerDetails = data.plannerDetails || {};
    } else if (data.category === 'performer') {
      payload.performerDetails = data.performerDetails || {};
    } else if (data.category === 'crew') {
      payload.crewDetails = data.crewDetails || {};
    }

    let savedItem;

    if (isMongoConnected()) {
      // Real MongoDB
      const newReq = new Requirement(payload);
      savedItem = await newReq.save();
      console.log(`[MongoDB] Saved new ${savedItem.category} requirement: "${savedItem.eventName}" (${savedItem._id})`);
    } else {
      // In-memory fallback
      savedItem = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.unshift(savedItem); // newest first
      console.log(`[MemoryStore] Saved new ${savedItem.category} requirement: "${savedItem.eventName}" (${savedItem._id})`);
    }

    return res.status(201).json({
      success: true,
      message: 'Requirement posted successfully!',
      data: savedItem,
      storage: isMongoConnected() ? 'mongodb' : 'memory-fallback'
    });
  } catch (err) {
    console.error('Error saving requirement:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving requirement',
      error: err.message
    });
  }
});

// GET: Fetch all requirements (with optional category filter & search)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let query = {};

      if (category && ['planner', 'performer', 'crew'].includes(category)) {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { eventName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      const list = await Requirement.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: list.length,
        data: list,
        storage: 'mongodb'
      });
    } else {
      // Filter memoryStore
      let results = [...memoryStore];

      if (category && ['planner', 'performer', 'crew'].includes(category)) {
        results = results.filter((item) => item.category === category);
      }

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (item) =>
            item.eventName.toLowerCase().includes(s) ||
            item.location.toLowerCase().includes(s)
        );
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
        storage: 'memory-fallback'
      });
    }
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve requirements',
      error: error.message
    });
  }
});

// GET: Fetch single requirement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const item = await Requirement.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Requirement not found' });
      }
      return res.json({ success: true, data: item });
    } else {
      const item = memoryStore.find((r) => r._id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Requirement not found' });
      }
      return res.json({ success: true, data: item });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid requirement ID format' });
  }
});

// DELETE: Delete a requirement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await Requirement.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      return res.json({ success: true, message: 'Deleted successfully' });
    } else {
      const initialLen = memoryStore.length;
      memoryStore = memoryStore.filter((r) => r._id !== id);
      if (memoryStore.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      return res.json({ success: true, message: 'Deleted successfully' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
