const mongoose = require('mongoose');

const upcomingProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    previewImage: { type: String, default: '' },
    previewImagePublicId: { type: String, default: '' },
    expectedStartDate: { type: Date },
    estimatedStatus: {
      type: String,
      enum: ['Planning', 'Design Phase', 'Approval Pending', 'Coming Soon', 'Announced'],
      default: 'Coming Soon',
    },
    projectConcept: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Structural', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Renovation', 'Other'],
      default: 'Other',
    },
    location: { type: String, default: '' },
    estimatedValue: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UpcomingProject', upcomingProjectSchema);
