import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { sendSuccessResponse } from "../helpers/functionsHelpers";
import {
  addImagesToProjectService,
  getProjectImagesService,
  updateImageService,
  deleteImageService,
} from "../services/imageService";

export const addImagesToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError("No se han subido imágenes", 400));
    }

    const images = await addImagesToProjectService(projectId, files);
    sendSuccessResponse(res, images, 201);
  } catch (error) {
    next(error);

    
  }
};

export const getProjectImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const images = await getProjectImagesService(projectId);
    sendSuccessResponse(res, images);
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const updateData = req.body;

    const updatedImage = await updateImageService(imageId, updateData);
    sendSuccessResponse(res, updatedImage);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const result = await deleteImageService(imageId);
    sendSuccessResponse(res, result);
  } catch (error) {
    next(error);
  }
};