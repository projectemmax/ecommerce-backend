import { diskStorage } from 'multer';
import { extname } from 'path';

export const reviewImageStorage = diskStorage({
  destination: './uploads/reviews',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});