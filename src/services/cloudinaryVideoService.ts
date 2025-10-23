import cloudinary from '../config/cloudinary';
import { AppError } from '../utils/appError';

export class CloudinaryVideoService {
  
  /**
   * Subir video a Cloudinary - SOLO propiedades que coinciden con entidad Video
   */
  static async uploadVideo(file: Express.Multer.File, folder: string = 'portafolio/videos'): Promise<{
    url: string;
    publicId: string;
    filename: string;
    mimetype: string;
    duration: number;
    size: number;
  }> {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'video',
            transformation: [
              { width: 1920, height: 1080, crop: 'limit' },
              { quality: 'auto' },
              { format: 'mp4' }
            ],
            chunk_size: 6000000,
          },
          (error, result) => {
            if (error) {
              console.error('Error subiendo video a Cloudinary:', error);
              reject(new AppError('Error al subir el video', 500));
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                filename: file.originalname,
                mimetype: file.mimetype,
                duration: result.duration || 0,
                size: result.bytes || 0
              });
            } else {
              reject(new AppError('No se recibió respuesta de Cloudinary', 500));
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error en uploadVideo:', error);
      throw error;
    }
  }

  /**
   * Subir múltiples videos
   */
  static async uploadMultipleVideos(files: Express.Multer.File[], folder: string = 'portafolio/videos'): Promise<Array<{
    url: string;
    publicId: string;
    filename: string;
    mimetype: string;
    duration: number;
    size: number;
  }>> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadVideo(file, folder)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error subiendo múltiples videos:', error);
      throw new AppError('Error al subir los videos', 500);
    }
  }

  /**
   * Eliminar video de Cloudinary
   */
  static async deleteVideo(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video'
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        console.warn(`Cloudinary delete result: ${result.result} for publicId: ${publicId}`);
        throw new AppError(`No se pudo eliminar el video: ${result.result}`, 400);
      }

      console.log(`Video eliminado de Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      console.error('Error eliminando video de Cloudinary:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        console.warn(`Video no encontrado en Cloudinary: ${publicId}`);
        return { result: 'not found' };
      }
      
      throw new AppError('Error al eliminar el video', 500);
    }
  }

  /**
   * Eliminar múltiples videos
   */
  static async deleteMultipleVideos(publicIds: string[]): Promise<Array<{ publicId: string; result: string }>> {
    try {
      const deletePromises = publicIds.map(async (publicId) => {
        try {
          const result = await this.deleteVideo(publicId);
          return { publicId, result: result.result };
        } catch (error) {
          console.error(`Error eliminando video ${publicId}:`, error);
          return { publicId, result: 'error' };
        }
      });

      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error eliminando múltiples videos:', error);
      throw new AppError('Error al eliminar los videos', 500);
    }
  }

  /**
   * Extraer public_id desde URL de Cloudinary
   */
  static extractPublicIdFromUrl(url: string): string | null {
    try {
      const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extrayendo public_id de URL de video:', error);
      return null;
    }
  }

  /**
   * Verificar si un video existe en Cloudinary
   */
  static async checkVideoExists(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video'
      });
      return !!result;
    } catch (error) {
      return false;
    }
  }
}