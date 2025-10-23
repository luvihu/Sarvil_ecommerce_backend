
import multer from 'multer';
import { Request } from 'express';

export const uploadProjectImages = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten JPEG, PNG, WebP y GIF`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Máximo 10 archivos
  },
}).array('images', 10); // Campo 'images', hasta 10 archivos