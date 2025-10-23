import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { sendSuccessResponse } from "../helpers/functionsHelpers";
import {
  addVideosToProjectService,
  getProjectVideosService,
  updateVideoService,
  deleteVideoService,
} from "../services/videoService";

export const addVideosToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError("No se han subido videos", 400));
    }

    const videos = await addVideosToProjectService(projectId, files);
    sendSuccessResponse(res, videos, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjectVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const videos = await getProjectVideosService(projectId);
    sendSuccessResponse(res, videos);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const updateData = req.body;

    const updatedVideo = await updateVideoService(videoId, updateData);
    sendSuccessResponse(res, updatedVideo);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const result = await deleteVideoService(videoId);
    sendSuccessResponse(res, result);
  } catch (error) {
    next(error);
  }
};