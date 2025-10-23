import { AppDataSource } from "../config/dataSource";
import { Video } from "../entities/Video";
import { Project } from "../entities/Project";
import { AppError } from "../utils/appError";
import { CloudinaryVideoService } from "../services/cloudinaryVideoService";
import { validateId } from "../helpers/functionsHelpers";

const videoRepository = AppDataSource.getRepository(Video);
const projectRepository = AppDataSource.getRepository(Project);

export const addVideosToProjectService = async (projectId: string, files: Express.Multer.File[]) => {
  if (!validateId(projectId)) {
    throw new AppError("ID de proyecto inválido", 400);
  }

  const project = await projectRepository.findOneBy({ id: projectId });
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  const folder = `portafolio/videos/${projectId}`;
  const uploadResults = await CloudinaryVideoService.uploadMultipleVideos(files, folder);

  const videos = uploadResults.map(result => 
    videoRepository.create({
      ...result,
      isActive: true,
      project: project,
    })
  );

  const savedVideos = await videoRepository.save(videos);
  return savedVideos;
};

export const getProjectVideosService = async (projectId: string) => {
  if (!validateId(projectId)) {
    throw new AppError("ID de proyecto inválido", 400);
  }

  const videos = await videoRepository.find({
    where: { project: { id: projectId } },
    order: { createdAt: "ASC" },
  });

  if (videos.length === 0) {
    throw new AppError("No se encontraron videos para este proyecto", 404);
  }

  return videos;
};

export const updateVideoService = async (videoId: string, updateData: Partial<Video>) => {
  if (!validateId(videoId)) {
    throw new AppError("ID de video inválido", 400);
  }

  const video = await videoRepository.findOneBy({ id: videoId });
  if (!video) {
    throw new AppError("Video no encontrado", 404);
  }

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

  Object.assign(video, filteredData);
  return await videoRepository.save(video);
};

export const deleteVideoService = async (videoId: string) => {
  if (!validateId(videoId)) {
    throw new AppError("ID de video inválido", 400);
  }

  const video = await videoRepository.findOne({
    where: { id: videoId },
    relations: ["project"],
  });

  if (!video) {
    throw new AppError("Video no encontrado", 404);
  }

  await CloudinaryVideoService.deleteVideo(video.publicId);
  await videoRepository.remove(video);

  return { message: "Video eliminado correctamente" };
};