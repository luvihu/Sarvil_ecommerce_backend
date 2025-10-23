import { AppDataSource } from "../config/dataSource";
import { Image } from "../entities/Image";
import { Project } from "../entities/Project";
import { AppError } from "../utils/appError";
import { CloudinaryImageService } from "../services/cloudinaryImageService";
import { validateId } from "../helpers/functionsHelpers";

const imageRepository = AppDataSource.getRepository(Image);
const projectRepository = AppDataSource.getRepository(Project);

export const addImagesToProjectService = async (projectId: string, files: Express.Multer.File[]) => {
  if (!validateId(projectId)) {
    throw new AppError("ID de proyecto inválido", 400);
  }

  const project = await projectRepository.findOneBy({ id: projectId });
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  const folder = `portafolio/images/${projectId}`;
  const uploadResults = await CloudinaryImageService.uploadMultipleImages(files, folder);

  const images = uploadResults.map(result => 
    imageRepository.create({
      ...result,
      isActive: true,
      project: project,
    })
  );

  const savedImages = await imageRepository.save(images);
  return savedImages;
};

export const getProjectImagesService = async (projectId: string) => {
  if (!validateId(projectId)) {
    throw new AppError("ID de proyecto inválido", 400);
  }

  const images = await imageRepository.find({
    where: { project: { id: projectId } },
    order: { createdAt: "ASC" },
  });

  if (images.length === 0) {
    throw new AppError("No se encontraron imágenes para este proyecto", 404);
  }

  return images;
};

export const updateImageService = async (imageId: string, updateData: Partial<Image>) => {
  if (!validateId(imageId)) {
    throw new AppError("ID de imagen inválido", 400);
  }

  const image = await imageRepository.findOneBy({ id: imageId });
  if (!image) {
    throw new AppError("Imagen no encontrada", 404);
  }

  // Solo permitimos actualizar campos específicos (ej. isActive)
  const allowedFields = ["isActive"];
  const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {} as Record<string, any>);

  if (Object.keys(filteredData).length === 0) {
    throw new AppError("No hay campos válidos para actualizar", 400);
  }

  Object.assign(image, filteredData);
  return await imageRepository.save(image);
};

export const deleteImageService = async (imageId: string) => {
  if (!validateId(imageId)) {
    throw new AppError("ID de imagen inválido", 400);
  }

  const image = await imageRepository.findOne({
    where: { id: imageId },
    relations: ["project"],
  });

  if (!image) {
    throw new AppError("Imagen no encontrada", 404);
  }

  // Eliminar de Cloudinary
  await CloudinaryImageService.deleteImage(image.publicId);

  // Eliminar de la base de datos
  await imageRepository.remove(image);

  return { message: "Imagen eliminada correctamente" };
};