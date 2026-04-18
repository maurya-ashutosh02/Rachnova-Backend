const mongoose = require('mongoose');

const ongoingProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ url: String, publicId: String }],
    startDate: { type: Date },
    expectedCompletionDate: { type: Date },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    currentPhase: { type: String, default: '' },
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completed: { type: Boolean, default: false },
      },
    ],
    category: {
      type: String,
      enum: ['Structural', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Renovation', 'Other'],
      default: 'Other',
    },
    location: { type: String, default: '' },
    clientName: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OngoingProject', ongoingProjectSchema);
