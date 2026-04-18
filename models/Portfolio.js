const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Structural', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Renovation', 'Other'],
      default: 'Other',
    },
    description: { type: String, required: true },
    technologiesUsed: [{ type: String }],
    images: [{ url: String, publicId: String }],
    completionDate: { type: Date },
    status: {
      type: String,
      enum: ['Completed', 'Ongoing', 'Upcoming'],
      default: 'Completed',
    },
    clientName: { type: String, default: '' },
    location: { type: String, default: '' },
    keyHighlights: [{ type: String }],
    beforeImages: [{ url: String, publicId: String }],
    afterImages: [{ url: String, publicId: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

portfolioSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
