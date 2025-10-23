import { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/appError';
import { sendSuccessResponse, validateId } from '../helpers/functionsHelpers';
import { allProjectService, createProjectService, updateProjectService, deleteProjectService } from "../services/projectService";
import { ICreateProject, IProject } from "../interfaces/Interfaces";

export const allProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await allProjectService();
    if(!projects) {
      return next(new AppError('No se encontraron proyectos', 404));
    }
    sendSuccessResponse(res, projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataBody: ICreateProject = req.body;
    if(!dataBody.title || !dataBody.description || !dataBody.category) {
      return next(new AppError('Faltan datos', 400));
    };
    const userId = (req as any).user?.userId;
    if(!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    };

    const project = await createProjectService({...dataBody, createdBy:userId });
    sendSuccessResponse(res, project, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validateIdResult = validateId(id);
    if (!validateIdResult) {
      return next(new AppError('Id invalido', 404));
    }
    const dataBody: Partial<IProject> = req.body;
    if (!dataBody) {
      return next(new AppError('Faltan datos', 400));
    };

    const updateProject = await updateProjectService(id, dataBody);
    if (!updateProject) {
      return next(new AppError('No se pudo actualizar proyecto', 404));
    };
    sendSuccessResponse(res, updateProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validateIdResult = validateId(id);
    if (!validateIdResult) {
      return next(new AppError('Id invalido', 404));
    }
    const deleteProject = await deleteProjectService(id);
    if (!deleteProject) {
      return next(new AppError('No se pudo eliminar proyecto', 404));
    }
    sendSuccessResponse(res, deleteProject);
  } catch (error) {
    next(error);
  }
};
