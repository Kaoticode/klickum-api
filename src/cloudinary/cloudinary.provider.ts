// cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import * as process from 'node:process';

dotenvConfig({ path: '.env' });

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
