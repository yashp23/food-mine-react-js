import { Router } from 'express';
import admin from '../middleware/admin.mid.js';
import multer from 'multer';
import handler from 'express-async-handler';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { configCloudinary } from '../config/cloudinary.config.js';

const router = Router();
const upload = multer();

router.post(
  '/',
  admin,
  upload.single('image'),
  handler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(BAD_REQUEST).send('No file uploaded');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file.buffer);
      res.send({ imageUrl });
    } catch (error) {
      res.status(BAD_REQUEST).send('Error uploading image to Cloudinary');
    }
  })
);

const uploadImageToCloudinary = imageBuffer => {
  const cloudinary = configCloudinary();

  return new Promise((resolve, reject) => {
    if (!imageBuffer) {
      return reject('No image buffer provided');
    }

    cloudinary.uploader.upload_stream((error, result) => {
      if (error || !result) {
        return reject(error || 'Upload failed');
      }
      resolve(result.url);
    }).end(imageBuffer);
  });
};

export default router;
