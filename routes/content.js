const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const AboutContent = require('../models/AboutContent');
const { SiteSettings } = require('../models/index');
const { protect } = require('../middleware/auth');
const { upload, saveFile } = require('../config/cloudinary');

// ── HOME ──────────────────────────────────────────────────────────────────────
router.get('/home', async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/home', protect, upload.single('heroImage'), async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = new HomeContent();
    const fields = ['heroTitle','heroSubtitle','heroTagline','heroCTA1','heroCTA2','heroCTA3',
      'statsProjects','statsYears','statsClients','statsTeam','featuredSectionTitle','featuredSectionSubtitle'];
    fields.forEach(f => { if (req.body[f] !== undefined) content[f] = req.body[f]; });
    if (req.file) {
      const saved = await saveFile(req.file);
      content.heroImage = saved.url;
      content.heroImagePublicId = saved.publicId;
    }
    await content.save();
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── ABOUT ─────────────────────────────────────────────────────────────────────
router.get('/about', async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) content = await AboutContent.create({});
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/about', protect, upload.fields([
  { name: 'founderImage', maxCount: 1 },
  { name: 'aboutImage',   maxCount: 1 },
]), async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) content = new AboutContent();
    const fields = ['title','subtitle','introduction','vision','mission','companyStory',
      'founderName','founderBio','professionalSummary','yearsOfExperience'];
    fields.forEach(f => { if (req.body[f] !== undefined) content[f] = req.body[f]; });
    if (req.body.coreValues)  content.coreValues  = JSON.parse(req.body.coreValues);
    if (req.body.whyChooseUs) content.whyChooseUs = JSON.parse(req.body.whyChooseUs);
    if (req.body.expertise)   content.expertise   = JSON.parse(req.body.expertise);

    if (req.files?.founderImage?.[0]) {
      const saved = await saveFile(req.files.founderImage[0]);
      content.founderImage = saved.url;
      content.founderImagePublicId = saved.publicId;
    }
    if (req.files?.aboutImage?.[0]) {
      const saved = await saveFile(req.files.aboutImage[0]);
      content.aboutImage = saved.url;
      content.aboutImagePublicId = saved.publicId;
    }
    await content.save();
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/settings', protect, upload.single('logo'), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    const fields = ['siteName','siteTagline','email','phone','phone2','address','city','state',
      'country','mapEmbedUrl','facebookUrl','instagramUrl','linkedinUrl','twitterUrl',
      'youtubeUrl','whatsappNumber','footerText','metaDescription','metaKeywords'];
    fields.forEach(f => { if (req.body[f] !== undefined) settings[f] = req.body[f]; });
    if (req.file) {
      const saved = await saveFile(req.file);
      settings.logo = saved.url;
      settings.logoPublicId = saved.publicId;
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── DASHBOARD STATS ───────────────────────────────────────────────────────────
router.get('/stats', protect, async (req, res) => {
  try {
    const CompletedProject = require('../models/CompletedProject');
    const OngoingProject   = require('../models/OngoingProject');
    const UpcomingProject  = require('../models/UpcomingProject');
    const Portfolio        = require('../models/Portfolio');
    const { Gallery, ContactMessage, Achievement } = require('../models/index');

    const [completed, ongoing, upcoming, portfolio, gallery, messages, unread, achievements] =
      await Promise.all([
        CompletedProject.countDocuments(),
        OngoingProject.countDocuments(),
        UpcomingProject.countDocuments(),
        Portfolio.countDocuments(),
        Gallery.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ read: false }),
        Achievement.countDocuments(),
      ]);

    res.json({
      success: true,
      data: {
        totalProjects: completed + ongoing + upcoming,
        completedProjects: completed,
        ongoingProjects: ongoing,
        upcomingProjects: upcoming,
        portfolioItems: portfolio,
        galleryImages: gallery,
        totalMessages: messages,
        unreadMessages: unread,
        achievements,
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
