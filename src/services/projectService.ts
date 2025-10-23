// services/projectService.ts
import { AppDataSource } from "../config/dataSource";
import { Project } from "../entities/Project";
import { AppError } from "../utils/appError";
import { IProject, ICreateProject } from "../interfaces/Interfaces";
import { CloudinaryImageService } from "./cloudinaryImageService";
import { CloudinaryVideoService } from "./cloudinaryVideoService";

const projectRepository = AppDataSource.getRepository(Project);

export const allProjectService = async () => {
  const projects = await projectRepository.find({
    where: { isVisible: true },
    relations: {
      images: true,
      videos: true,
      createdBy: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      isVisible: true,
      images: {
        id: true,
        url: true,
        isActive: true,
      },
      videos: {
        id: true,
        url: true,
        isActive: true,
      },
      createdBy: {
        id: true,
        name: true,
      },
    },
  });
  return projects;
};

export const createProjectService = async (data: ICreateProject & { createdBy: string }) => {
  const { createdBy, ...dataBody } = data;

  const existProject = await projectRepository.findOneBy({ title: dataBody.title });
  if (existProject) {
    throw new AppError("Proyecto ya existe", 400);
  }

  const project = projectRepository.create({
    ...dataBody,
    createdBy: { id: createdBy },
  });

  const savedProject = await projectRepository.save(project);
  const projectWithRelations = await projectRepository.findOne({
    where: { id: savedProject.id },
    relations: { createdBy: true },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      isVisible: true,
      createdBy: {
        id: true,
        name: true,
      },
    },
  });

  return projectWithRelations;
};

export const updateProjectService = async (id: string, data: Partial<IProject>) => {
  const project = await projectRepository.findOneBy({ id });
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  const allowedFields: (keyof IProject)[] = ["title", "description", "category", "isVisible"];
  
  // ✅ Solución segura y limpia
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) =>
      allowedFields.includes(key as keyof IProject)
    )
  ) as Partial<IProject>;

  if (Object.keys(filteredData).length === 0) {
    throw new AppError("No hay campos válidos para actualizar", 400);
  }

  projectRepository.merge(project, filteredData);
  const updatedProject = await projectRepository.save(project);

  const projectWithRelations = await projectRepository.findOne({
    where: { id: updatedProject.id },
    relations: {
      images: true,
      videos: true,
      createdBy: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      isVisible: true,
      images: {
        id: true,
        url: true,
        isActive: true,
      },
      videos: {
        id: true,
        url: true,
        isActive: true,
      },
      createdBy: {
        id: true,
        name: true,
      },
    },
  });

  return projectWithRelations;
};

export const deleteProjectService = async (id: string) => {
  // Cargamos el proyecto con sus imágenes y videos
  const project = await projectRepository.findOne({
    where: { id },
    relations: {
      images: true,
      videos: true,
    },
  });

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  // Extraer publicIds para eliminar de Cloudinary
  const imagePublicIds = project.images?.map(img => img.publicId).filter(Boolean) as string[];
  const videoPublicIds = project.videos?.map(vid => vid.publicId).filter(Boolean) as string[];

  // Eliminar recursos de Cloudinary (en paralelo para eficiencia)
  const cloudinaryDeletions:  Promise<any>[] = [];
  if (imagePublicIds.length > 0) {
    cloudinaryDeletions.push(CloudinaryImageService.deleteMultipleImages(imagePublicIds));
  }
  if (videoPublicIds.length > 0) {
    cloudinaryDeletions.push(CloudinaryVideoService.deleteMultipleVideos(videoPublicIds));
  }

  await Promise.all(cloudinaryDeletions);

  // Eliminar el proyecto (y por CASCADE, imágenes y videos en DB)
  const deletedProject = await projectRepository.remove(project);
  return deletedProject;
};