const express = require('express');
const router = express.Router();
const { Gallery, Testimonial, ContactMessage } = require('../models/index');
const { protect } = require('../middleware/auth');
const { upload, saveFile, saveFiles, deleteImage } = require('../config/cloudinary');

// ── GALLERY ───────────────────────────────────────────────────────────────────
router.get('/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/gallery', protect, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No images provided' });
    const { category = 'Projects', caption = '', alt = '' } = req.body;
    const saved = await saveFiles(req.files);
    const docs = saved.map(s => ({ url: s.url, publicId: s.publicId, category, caption, alt }));
    const created = await Gallery.insertMany(docs);
    res.status(201).json({ success: true, data: created });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/gallery/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/gallery/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    if (item.publicId) await deleteImage(item.publicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
router.get('/testimonials', async (req, res) => {
  try {
    const items = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/testimonials/all', protect, async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/testimonials', protect, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.photo = saved.url;
      data.photoPublicId = saved.publicId;
    }
    const item = await Testimonial.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/testimonials/:id', protect, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.photo = saved.url;
      data.photoPublicId = saved.publicId;
    }
    const item = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/testimonials/:id', protect, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (item?.photoPublicId) await deleteImage(item.photoPublicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── CONTACT MESSAGES ──────────────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    const msg = await ContactMessage.create({ name, email, phone, subject, message, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: { id: msg._id } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/contact/messages', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;
    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);
    res.json({ success: true, data: messages, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/contact/messages/:id/read', protect, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/contact/messages/:id', protect, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
