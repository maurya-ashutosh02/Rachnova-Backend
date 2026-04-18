const mongoose = require('mongoose');

// Service Model
const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Education Model
const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, default: '' },
    relevantSubjects: [{ type: String }],
    academicAchievements: { type: String, default: '' },
    grade: { type: String, default: '' },
    certificate: { type: String, default: '' },
    certificatePublicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Achievement Model
const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Award', 'Certification', 'Milestone', 'Recognition', 'Competition', 'Training', 'Professional'],
      default: 'Professional',
    },
    date: { type: Date },
    year: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    issuingOrganization: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Gallery Model
const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Projects', 'Achievements', 'Team', 'Site', 'Events', 'Other'],
      default: 'Projects',
    },
    alt: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Testimonial Model
const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectReference: { type: String, default: '' },
    photo: { type: String, default: '' },
    photoPublicId: { type: String, default: '' },
    designation: { type: String, default: '' },
    company: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Contact Message Model
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

// Site Settings Model
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Rachnova Projects' },
    siteTagline: { type: String, default: 'Engineering Excellence' },
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    favicon: { type: String, default: '' },
    email: { type: String, default: 'info@rachnovaprojects.com' },
    phone: { type: String, default: '+91 9876543210' },
    phone2: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    mapEmbedUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    footerText: { type: String, default: '© 2024 Rachnova Projects. All rights reserved.' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = {
  Service: mongoose.model('Service', serviceSchema),
  Education: mongoose.model('Education', educationSchema),
  Achievement: mongoose.model('Achievement', achievementSchema),
  Gallery: mongoose.model('Gallery', gallerySchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  ContactMessage: mongoose.model('ContactMessage', contactMessageSchema),
  SiteSettings: mongoose.model('SiteSettings', siteSettingsSchema),
};
