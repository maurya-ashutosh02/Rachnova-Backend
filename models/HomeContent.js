const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Building Tomorrow\'s Infrastructure Today' },
    heroSubtitle: { type: String, default: 'Rachnova Projects — Engineering Excellence, Structural Precision, Project Mastery' },
    heroTagline: { type: String, default: 'Transforming visions into landmark structures' },
    heroImage: { type: String, default: '' },
    heroImagePublicId: { type: String, default: '' },
    heroCTA1: { type: String, default: 'View Projects' },
    heroCTA2: { type: String, default: 'Contact Us' },
    heroCTA3: { type: String, default: 'Explore Portfolio' },
    statsProjects: { type: Number, default: 50 },
    statsYears: { type: Number, default: 10 },
    statsClients: { type: Number, default: 30 },
    statsTeam: { type: Number, default: 20 },
    featuredSectionTitle: { type: String, default: 'Our Featured Works' },
    featuredSectionSubtitle: { type: String, default: 'Explore our landmark projects across engineering and construction' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeContent', homeContentSchema);
