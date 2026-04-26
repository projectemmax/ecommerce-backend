import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadPath = './uploads/avatars/admin';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const adminAvatarStorage = diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, `${unique}${extname(file.originalname)}`);
  },
});