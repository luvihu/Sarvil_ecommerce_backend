import { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/appError';
import { allInquiryService, createInquiryService } from '../services/inquiryService';
import { sendSuccessResponse } from '../helpers/functionsHelpers';
import { ICreateInquiry } from "../interfaces/Interfaces";
import validator from 'validator';

export const allInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await allInquiryService();
    if (!inquiries.length) {
      return next(new AppError('No se encontraron consultas', 404));
    }
    sendSuccessResponse(res, inquiries);
  } catch (error) {
    next(error);
  }
};

export const  createInquiry = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const dataBody: ICreateInquiry = req.body;
    if(!dataBody.name || !dataBody.email || !dataBody.message) {
      return next(new AppError('Faltan datos', 400));
    }

    if(!validator.isEmail(dataBody.email)) {
      return next(new AppError('Email invalido', 400));
    }

    if (dataBody.name.length < 2 || dataBody.name.length > 100) {
      return next(new AppError('El nombre debe tener entre 2 y 100 caracteres', 400));
    };

     if (dataBody.message.trim().length < 5 || dataBody.message.length > 2000) {
      return next(new AppError('El mensaje debe tener entre 5 y 2000 caracteres', 400));
    };
    
    const inquiry = await createInquiryService(dataBody);
    return sendSuccessResponse(res, inquiry, 201);
  } catch (error) {
    next(error);
  }
};
