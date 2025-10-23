import { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/appError';
import { sendSuccessResponse, validateId } from '../helpers/functionsHelpers';
import { createPlanService, allPlanService, updatePlanService, deletePlanService } from '../services/planService';
import { IPlan } from '../interfaces/Interfaces';

export const allPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await allPlanService();
      if(!plans.length) {
      throw new AppError('No se encontraron planes', 404);
    }
    sendSuccessResponse(res, plans);
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataBody: IPlan = req.body;
    if(!dataBody.name || !dataBody.deliverables || !dataBody.priceRange) {
      return next(new AppError('Faltan datos', 400));
    };

    const userId = (req as any).user?.userId;
    if(!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    };

    const plan = await createPlanService({...dataBody, createdBy: userId});
    if(!plan) {
      return next(new AppError('No se pudo crear plan', 404));
    };
    sendSuccessResponse(res, plan, 201);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const validateIdResult = validateId(id);
    if(!validateIdResult) {
      return next(new AppError('Id invalido', 404));
    };
    const dataBody: Partial<IPlan> = req.body;
    if(!dataBody) {
      return next(new AppError('Faltan datos', 400));
    }

    const updatePlan = await updatePlanService(id, dataBody);
    if(!updatePlan) {
      return next(new AppError('No se pudo actualizar plan', 404));
    };
    sendSuccessResponse(res, updatePlan);
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const validateIdResult = validateId(id);
    if(!validateIdResult) {
      return next(new AppError('Id invalido', 404));
    };
    const deletePlan = await deletePlanService(id);
    if(!deletePlan) {
      return next(new AppError('No se pudo eliminar plan', 404));
    };
    sendSuccessResponse(res, deletePlan);
  } catch (error) {
    next(error);
  }
};
