const mongoose = require('mongoose');

const completedProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ url: String, publicId: String }],
    startDate: { type: Date },
    completionDate: { type: Date },
    completionYear: { type: Number },
    scopeOfWork: { type: String, default: '' },
    challenges: { type: String, default: '' },
    results: { type: String, default: '' },
    outcomes: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Structural', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Renovation', 'Other'],
      default: 'Other',
    },
    location: { type: String, default: '' },
    clientName: { type: String, default: '' },
    projectValue: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompletedProject', completedProjectSchema);
