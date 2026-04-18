const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'About Rachnova Projects' },
    subtitle: { type: String, default: 'A Legacy of Engineering Excellence' },
    introduction: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: { type: String, default: '' },
    companyStory: { type: String, default: '' },
    founderName: { type: String, default: '' },
    founderBio: { type: String, default: '' },
    founderImage: { type: String, default: '' },
    founderImagePublicId: { type: String, default: '' },
    coreValues: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    whyChooseUs: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    professionalSummary: { type: String, default: '' },
    aboutImage: { type: String, default: '' },
    aboutImagePublicId: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 10 },
    expertise: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutContent', aboutContentSchema);
