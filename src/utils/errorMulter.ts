// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import multer from 'multer';

export const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('El archivo es demasiado grande', 400));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Demasiados archivos', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Campo de archivo inesperado', 400));
    }
  }
  
  if (error.message.includes('Tipo de archivo no permitido')) {
    return next(new AppError(error.message, 400));
  }

  next(error);
};