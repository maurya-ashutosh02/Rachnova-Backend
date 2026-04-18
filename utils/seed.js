require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const HomeContent = require('../models/HomeContent');
const AboutContent = require('../models/AboutContent');
const { SiteSettings, Service, Education, Achievement } = require('../models/index');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting database seed...');

  // Create Admin
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: 'Rachnova Admin',
      email: process.env.ADMIN_EMAIL || 'admin@rachnovaprojects.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@2024Rachnova',
    });
    console.log('✅ Admin created');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Create Home Content
  const homeExists = await HomeContent.findOne();
  if (!homeExists) {
    await HomeContent.create({
      heroTitle: 'Building Tomorrow\'s Infrastructure Today',
      heroSubtitle: 'Rachnova Projects — Engineering Excellence, Structural Precision, Project Mastery',
      heroTagline: 'Transforming visions into landmark structures across India',
      heroCTA1: 'View Projects',
      heroCTA2: 'Contact Us',
      heroCTA3: 'Explore Portfolio',
      statsProjects: 50,
      statsYears: 10,
      statsClients: 30,
      statsTeam: 20,
      featuredSectionTitle: 'Our Featured Works',
      featuredSectionSubtitle: 'Explore landmark projects across structural engineering and construction',
    });
    console.log('✅ Home content created');
  }

  // Create About Content
  const aboutExists = await AboutContent.findOne();
  if (!aboutExists) {
    await AboutContent.create({
      title: 'About Rachnova Projects',
      subtitle: 'A Legacy of Engineering Excellence',
      introduction: 'Rachnova Projects is a premier engineering and construction company dedicated to delivering world-class infrastructure solutions. With a commitment to precision, quality, and innovation, we have established ourselves as a trusted name in the construction and engineering sector.',
      vision: 'To be the most trusted and innovative engineering company in India, known for delivering landmark infrastructure that shapes communities and drives progress.',
      mission: 'To deliver exceptional construction and engineering solutions through precision, innovation, and integrity — ensuring every project exceeds client expectations while contributing positively to society.',
      companyStory: 'Founded with a passion for engineering excellence, Rachnova Projects started as a small consultancy and grew into a full-fledged construction and project management firm. Our journey reflects our commitment to quality and client satisfaction.',
      founderName: 'Founder, Rachnova Projects',
      professionalSummary: 'Expert in structural design, construction planning, and project management with over a decade of experience delivering complex infrastructure projects across India.',
      coreValues: [
        { title: 'Integrity', description: 'We uphold the highest standards of honesty and transparency', icon: '🏛️' },
        { title: 'Excellence', description: 'We pursue perfection in every project we undertake', icon: '⭐' },
        { title: 'Innovation', description: 'We embrace modern techniques and forward-thinking solutions', icon: '💡' },
        { title: 'Safety', description: 'Safety is paramount in all our operations and deliveries', icon: '🛡️' },
      ],
      whyChooseUs: [
        { title: 'Proven Track Record', description: '50+ projects successfully delivered on time and budget', icon: '✅' },
        { title: 'Expert Team', description: 'Qualified engineers, architects, and project managers', icon: '👷' },
        { title: 'End-to-End Solutions', description: 'From planning to execution — we handle everything', icon: '🔧' },
        { title: 'Quality Assurance', description: 'Rigorous quality checks at every project milestone', icon: '🎯' },
      ],
      expertise: ['Structural Engineering', 'Construction Management', 'Project Planning', 'Cost Estimation', 'Site Supervision', 'Architectural Design'],
      yearsOfExperience: 10,
    });
    console.log('✅ About content created');
  }

  // Create Site Settings
  const settingsExist = await SiteSettings.findOne();
  if (!settingsExist) {
    await SiteSettings.create({
      siteName: 'Rachnova Projects',
      siteTagline: 'Engineering Excellence',
      email: 'info@rachnovaprojects.com',
      phone: '+91 98765 43210',
      address: 'Plot No. 123, Engineering Hub',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      footerText: '© 2024 Rachnova Projects. All rights reserved. Built with engineering precision.',
      metaDescription: 'Rachnova Projects - Leading construction and engineering company specializing in structural design, construction management, and project execution.',
      metaKeywords: 'construction, engineering, infrastructure, structural design, project management, Rachnova',
    });
    console.log('✅ Site settings created');
  }

  // Seed Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { title: 'Structural Design', description: 'Comprehensive structural design services for residential, commercial, and industrial projects ensuring safety and efficiency.', icon: '🏗️', features: ['Foundation Design', 'RCC Design', 'Steel Structures', 'Load Analysis'], order: 1 },
      { title: 'Construction Planning', description: 'End-to-end construction planning including scheduling, resource allocation, and project phasing.', icon: '📐', features: ['Project Scheduling', 'Resource Planning', 'Risk Management', 'Budget Planning'], order: 2 },
      { title: 'Site Execution', description: 'Professional on-site execution with qualified engineers supervising every phase of construction.', icon: '👷', features: ['Site Supervision', 'Quality Control', 'Safety Management', 'Progress Monitoring'], order: 3 },
      { title: 'Project Management', description: 'Complete project management from inception to handover, ensuring timely delivery within budget.', icon: '📊', features: ['Timeline Management', 'Stakeholder Coordination', 'Cost Control', 'Documentation'], order: 4 },
      { title: 'Estimation & Costing', description: 'Accurate and detailed cost estimation for construction projects, materials, and labor.', icon: '💰', features: ['BOQ Preparation', 'Rate Analysis', 'Cost Optimization', 'Tender Support'], order: 5 },
      { title: 'Engineering Consultation', description: 'Expert engineering consultation for technical challenges, design reviews, and compliance.', icon: '🔬', features: ['Technical Review', 'Design Audit', 'Code Compliance', 'Feasibility Study'], order: 6 },
    ]);
    console.log('✅ Services created');
  }

  // Seed Education
  const eduCount = await Education.countDocuments();
  if (eduCount === 0) {
    await Education.insertMany([
      { degree: 'Bachelor of Engineering (Civil)', institution: 'Savitribai Phule Pune University', year: '2010-2014', description: 'Specialized in structural engineering with distinction. Completed multiple projects on structural analysis and design.', relevantSubjects: ['Structural Analysis', 'Concrete Technology', 'Soil Mechanics', 'Project Management', 'AutoCAD'], grade: 'First Class with Distinction', order: 1 },
      { degree: 'Master of Technology (Structural Engineering)', institution: 'IIT Bombay', year: '2014-2016', description: 'Advanced studies in structural engineering focusing on seismic design and modern construction techniques.', relevantSubjects: ['Advanced Structural Analysis', 'Seismic Design', 'FEM', 'Research Methodology'], grade: 'First Class', order: 2 },
    ]);
    console.log('✅ Education created');
  }

  // Seed Achievements
  const achieveCount = await Achievement.countDocuments();
  if (achieveCount === 0) {
    await Achievement.insertMany([
      { title: 'Best Construction Project Award 2022', description: 'Awarded by Maharashtra Construction Federation for excellence in residential project delivery.', category: 'Award', year: '2022', issuingOrganization: 'Maharashtra Construction Federation', featured: true, order: 1 },
      { title: 'LEED Certified Professional', description: 'Leadership in Energy and Environmental Design certification for sustainable construction practices.', category: 'Certification', year: '2020', issuingOrganization: 'USGBC', featured: true, order: 2 },
      { title: '50 Projects Milestone', description: 'Successfully completed 50 projects across residential, commercial, and infrastructure sectors.', category: 'Milestone', year: '2023', featured: true, order: 3 },
      { title: 'ISO 9001:2015 Certified', description: 'Quality management system certification ensuring consistent delivery of high-quality construction services.', category: 'Certification', year: '2021', issuingOrganization: 'Bureau Veritas', order: 4 },
    ]);
    console.log('✅ Achievements created');
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@rachnovaprojects.com'}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@2024Rachnova'}`);
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
