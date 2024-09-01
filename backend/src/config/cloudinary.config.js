import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import { v2 as cloudinary } from 'cloudinary';

export const configCloudinary = () => {
  cloudinary.config({
    cloud_name: dmder2l0x,
    // process.env.CLOUDINARY_CLOUD_NAME,
    api_key: 621417996436896,
    // process.env.CLOUDINARY_API_KEY,
    api_secret: E8HmLiMRaYJ50OqqHZulHwPY7cE

    //process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};
