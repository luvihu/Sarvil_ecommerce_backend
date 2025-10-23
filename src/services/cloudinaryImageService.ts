import cloudinary from '../config/cloudinary';
import { AppError } from '../utils/appError';

export class CloudinaryImageService {
  
  static async uploadImage(file: Express.Multer.File, folder: string = 'portafolio/images'): Promise<{
    url: string;
    publicId: string;
    filename: string;
    mimetype: string;
    width: number;
    height: number;
  }> {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Error subiendo imagen a Cloudinary:', error);
              reject(new AppError('Error al subir la imagen', 500));
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                filename: file.originalname,
                mimetype: file.mimetype,
                width: result.width || 0,
                height: result.height || 0
              });
            } else {
              reject(new AppError('No se recibió respuesta de Cloudinary', 500));
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }

  /**
   * Subir múltiples imágenes
   */
  static async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'portafolio/images'): Promise<Array<{
    url: string;
    publicId: string;
    filename: string;
    mimetype: string;
    width: number;
    height: number;
  }>> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadImage(file, folder)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error subiendo múltiples imágenes:', error);
      throw new AppError('Error al subir las imágenes', 500);
    }
  }

  /**
   * Eliminar imagen de Cloudinary
   */
  static async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image'
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        console.warn(`Cloudinary delete result: ${result.result} for publicId: ${publicId}`);
        throw new AppError(`No se pudo eliminar la imagen: ${result.result}`, 400);
      }

      console.log(`Imagen eliminada de Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      console.error('Error eliminando imagen de Cloudinary:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        console.warn(`Imagen no encontrada en Cloudinary: ${publicId}`);
        return { result: 'not found' };
      }
      
      throw new AppError('Error al eliminar la imagen', 500);
    }
  }

  /**
   * Eliminar múltiples imágenes
   */
  static async deleteMultipleImages(publicIds: string[]): Promise<Array<{ publicId: string; result: string }>> {
    try {
      const deletePromises = publicIds.map(async (publicId) => {
        try {
          const result = await this.deleteImage(publicId);
          return { publicId, result: result.result };
        } catch (error) {
          console.error(`Error eliminando imagen ${publicId}:`, error);
          return { publicId, result: 'error' };
        }
      });

      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error eliminando múltiples imágenes:', error);
      throw new AppError('Error al eliminar las imágenes', 500);
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
      console.error('Error extrayendo public_id de URL:', error);
      return null;
    }
  }

  /**
   * Verificar si una imagen existe en Cloudinary
   */
  static async checkImageExists(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'image'
      });
      return !!result;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generar URL optimizada con transformaciones
   */
  static generateOptimizedUrl(publicId: string, width: number = 800, height: number = 600): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width, height, crop: 'fill' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });
  }

  /**
   * Generar thumbnail
   */
  static generateThumbnailUrl(publicId: string, width: number = 300, height: number = 200): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width, height, crop: 'fill' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });
  }
}