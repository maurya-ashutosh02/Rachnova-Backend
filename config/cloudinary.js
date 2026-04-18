const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

console.log(useCloudinary
  ? `☁️  Cloudinary ready → cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`
  : '📁  Local storage active'
);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const okExt  = allowed.test(path.extname(file.originalname).toLowerCase());
  const okMime = allowed.test(file.mimetype);
  if (okExt && okMime) return cb(null, true);
  cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const streamToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const s = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (err, result) => err ? reject(err) : resolve(result)
    );
    Readable.from(buffer).pipe(s);
  });

const saveFile = async (file, folder = 'rachnova-projects') => {
  if (!file) return null;
  if (useCloudinary) {
    const r = await streamToCloudinary(file.buffer, folder);
    return { url: r.secure_url, publicId: r.public_id };
  }
  const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
  fs.writeFileSync(path.join(uploadsDir, name), file.buffer);
  return { url: '/uploads/' + name, publicId: name };
};

const saveFiles = async (files, folder = 'rachnova-projects') => {
  if (!files?.length) return [];
  return Promise.all(files.map(f => saveFile(f, folder)));
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  if (useCloudinary) {
    try { await cloudinary.uploader.destroy(publicId); }
    catch (err) { console.error('Cloudinary delete error:', err.message); }
  } else {
    const p = path.join(uploadsDir, publicId);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
};

module.exports = { upload, saveFile, saveFiles, deleteImage, cloudinary, useCloudinary };
