import { AppDataSource } from "../config/dataSource";
import { Inquiry } from "../entities/Inquiry";
import { sendInquiryEmails } from '../services/emailService';
import { AppError } from '../utils/appError';
import { ICreateInquiry } from '../interfaces/Interfaces';

const inquiryRepository = AppDataSource.getRepository(Inquiry);

export const allInquiryService = async () => {
  const inquiries = await inquiryRepository.find();
   return inquiries;
}

export const createInquiryService = async (dataBody: ICreateInquiry) => {
 
  const inquiry = inquiryRepository.create({
   name: dataBody.name.trim(),
    email: dataBody.email.toLocaleLowerCase().trim(),
    message: dataBody.message.trim(),
    phone: dataBody.phone.trim(),
    selectedPlan: dataBody.selectedPlan.trim(),
  });
  const sendInquiry = await inquiryRepository.save(inquiry);

  return await sendInquiryEmails(sendInquiry)
 
}
