const express = require('express');
const router = express.Router();
const { Service, Education, Achievement } = require('../models/index');
const { protect } = require('../middleware/auth');
const { upload, saveFile, deleteImage } = require('../config/cloudinary');

// ── SERVICES ──────────────────────────────────────────────────────────────────
router.get('/services', async (req, res) => {
  try {
    const items = await Service.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/services/all', protect, async (req, res) => {
  try {
    const items = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/services', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.features) data.features = JSON.parse(req.body.features);
    if (req.file) {
      const saved = await saveFile(req.file);
      data.image = saved.url;
      data.imagePublicId = saved.publicId;
    }
    const item = await Service.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/services/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.features) data.features = JSON.parse(req.body.features);
    if (req.file) {
      const saved = await saveFile(req.file);
      data.image = saved.url;
      data.imagePublicId = saved.publicId;
    }
    const item = await Service.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/services/:id', protect, async (req, res) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (item?.imagePublicId) await deleteImage(item.imagePublicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── EDUCATION ─────────────────────────────────────────────────────────────────
router.get('/education', async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/education', protect, upload.single('certificate'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.relevantSubjects) data.relevantSubjects = JSON.parse(req.body.relevantSubjects);
    if (req.file) {
      const saved = await saveFile(req.file);
      data.certificate = saved.url;
      data.certificatePublicId = saved.publicId;
    }
    const item = await Education.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/education/:id', protect, upload.single('certificate'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.relevantSubjects) data.relevantSubjects = JSON.parse(req.body.relevantSubjects);
    if (req.file) {
      const saved = await saveFile(req.file);
      data.certificate = saved.url;
      data.certificatePublicId = saved.publicId;
    }
    const item = await Education.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/education/:id', protect, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
router.get('/achievements', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const items = await Achievement.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/achievements', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.image = saved.url;
      data.imagePublicId = saved.publicId;
    }
    const item = await Achievement.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/achievements/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.image = saved.url;
      data.imagePublicId = saved.publicId;
    }
    const item = await Achievement.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/achievements/:id', protect, async (req, res) => {
  try {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (item?.imagePublicId) await deleteImage(item.imagePublicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
