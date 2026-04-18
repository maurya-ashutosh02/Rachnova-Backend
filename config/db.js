const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌  MONGODB_URI is not defined!');
    console.error('    → Create a .env file inside the backend/ folder.');
    console.error('    → Add this line: MONGODB_URI=mongodb://localhost:27017/rachnova_projects\n');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('   → Make sure MongoDB is running, or use a MongoDB Atlas connection string.');
    process.exit(1);
  }
};

module.exports = connectDB;

module.exports = connectDB;
