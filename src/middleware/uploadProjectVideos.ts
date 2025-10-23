
import multer from 'multer';
import { Request } from 'express';

export const uploadProjectVideos = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedTypes = [
      'video/mp4', 
      'video/avi', 
      'video/mov', 
      'video/webm',
      'video/mkv',
      'video/flv',
      'video/wmv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de video no permitido: ${file.mimetype}. Solo se permiten MP4, AVI, MOV, WebM, MKV, FLV, WMV`), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB - videos son más grandes
    files: 3, // Máximo 3 videos por proyecto
  },
}).array('videos', 3); // Campo 'videos', hasta 3 archivos