const express = require('express');
const MeditationResource = require('../models/MeditationResource');
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/roleGuard');
const router = express.Router();

// Get all resources - public can see public ones, authenticated see all
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (!req.user) {
      query.isPublic = true;
    }
    // If authenticated, show all or filter by query params
    const { type, tag } = req.query;
    if (type) query.type = type;
    if (tag) query.tags = { $in: [tag] };
    const resources = await MeditationResource.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await MeditationResource.findById(req.params.id)
      .populate('createdBy', 'name email role');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    if (!resource.isPublic && !req.user) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ resource });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create resource - doctors and admins
router.post('/', requireAuth, permit('DOCTOR', 'ADMIN'), async (req, res) => {
  try {
    const { title, description, content, type, tags, isPublic } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const resource = new MeditationResource({
      title,
      description,
      content,
      type,
      tags: tags || [],
      createdBy: req.user.id,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    await resource.save();
    await resource.populate('createdBy', 'name email role');
    res.status(201).json({ resource });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resource - creator or admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const resource = await MeditationResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    // Check permission
    if (req.user.role !== 'ADMIN' && resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, description, content, type, tags, isPublic } = req.body;
    if (title) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (content !== undefined) resource.content = content;
    if (type) resource.type = type;
    if (tags) resource.tags = tags;
    if (isPublic !== undefined) resource.isPublic = isPublic;
    await resource.save();
    await resource.populate('createdBy', 'name email role');
    res.json({ resource });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resource - creator or admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const resource = await MeditationResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    // Check permission
    if (req.user.role !== 'ADMIN' && resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await MeditationResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;