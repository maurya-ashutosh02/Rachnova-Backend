const express = require('express');
const router = express.Router();
const CompletedProject = require('../models/CompletedProject');
const OngoingProject   = require('../models/OngoingProject');
const UpcomingProject  = require('../models/UpcomingProject');
const { protect } = require('../middleware/auth');
const { upload, saveFile, saveFiles, deleteImage } = require('../config/cloudinary');

// ── helpers ──────────────────────────────────────────────────────────────────
const listRoute = (Model) => async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Model.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Model.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getOne = (Model) => async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── COMPLETED ─────────────────────────────────────────────────────────────────
router.get('/completed',      listRoute(CompletedProject));
router.get('/completed/:id',  getOne(CompletedProject));

router.post('/completed', protect, upload.array('photos', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) data.photos = await saveFiles(req.files);
    const item = await CompletedProject.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/completed/:id', protect, upload.array('photos', 10), async (req, res) => {
  try {
    const item = await CompletedProject.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    const data = { ...req.body };
    if (req.files?.length) {
      const newPhotos = await saveFiles(req.files);
      data.photos = [...(item.photos || []), ...newPhotos];
    }
    const updated = await CompletedProject.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/completed/:id', protect, async (req, res) => {
  try {
    const item = await CompletedProject.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    for (const img of item.photos || []) await deleteImage(img.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── ONGOING ───────────────────────────────────────────────────────────────────
router.get('/ongoing',      listRoute(OngoingProject));
router.get('/ongoing/:id',  getOne(OngoingProject));

router.post('/ongoing', protect, upload.array('images', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.milestones) data.milestones = JSON.parse(req.body.milestones);
    if (req.files?.length) data.images = await saveFiles(req.files);
    const item = await OngoingProject.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/ongoing/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const item = await OngoingProject.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    const data = { ...req.body };
    if (req.body.milestones) data.milestones = JSON.parse(req.body.milestones);
    if (req.files?.length) {
      const newImgs = await saveFiles(req.files);
      data.images = [...(item.images || []), ...newImgs];
    }
    const updated = await OngoingProject.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/ongoing/:id', protect, async (req, res) => {
  try {
    const item = await OngoingProject.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    for (const img of item.images || []) await deleteImage(img.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── UPCOMING ──────────────────────────────────────────────────────────────────
router.get('/upcoming', async (req, res) => {
  try {
    const items = await UpcomingProject.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/upcoming/:id', getOne(UpcomingProject));

router.post('/upcoming', protect, upload.single('previewImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.previewImage = saved.url;
      data.previewImagePublicId = saved.publicId;
    }
    const item = await UpcomingProject.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/upcoming/:id', protect, upload.single('previewImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const saved = await saveFile(req.file);
      data.previewImage = saved.url;
      data.previewImagePublicId = saved.publicId;
    }
    const updated = await UpcomingProject.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/upcoming/:id', protect, async (req, res) => {
  try {
    const item = await UpcomingProject.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    if (item.previewImagePublicId) await deleteImage(item.previewImagePublicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
