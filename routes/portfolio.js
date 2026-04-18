const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');
const { upload, saveFile, saveFiles, deleteImage } = require('../config/cloudinary');

// GET all portfolio (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Portfolio.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Portfolio.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.technologiesUsed) data.technologiesUsed = JSON.parse(req.body.technologiesUsed);
    if (req.body.keyHighlights) data.keyHighlights = JSON.parse(req.body.keyHighlights);
    if (req.files?.length) {
      data.images = await saveFiles(req.files);
    }
    const item = await Portfolio.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    const data = { ...req.body };
    if (req.body.technologiesUsed) data.technologiesUsed = JSON.parse(req.body.technologiesUsed);
    if (req.body.keyHighlights) data.keyHighlights = JSON.parse(req.body.keyHighlights);
    if (req.files?.length) {
      const newImages = await saveFiles(req.files);
      data.images = [...(item.images || []), ...newImages];
    }
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    for (const img of item.images || []) await deleteImage(img.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
