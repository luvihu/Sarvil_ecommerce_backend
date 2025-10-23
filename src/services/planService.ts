import { AppDataSource } from "../config/dataSource";
import { Plan } from "../entities/Plan";
import { AppError } from '../utils/appError';
import { IPlan, ICreatePlan } from '../interfaces/Interfaces';

const planRepository = AppDataSource.getRepository(Plan);

export const allPlanService = async () => {
  const plans = await planRepository.find({
    relations:{ createdBy: true},
    select: {
      id:true,
    name:true,
    description:true,
    deliverables:true,
    priceRange:true,
    isActive: true,
    createdBy: {
      id:true,
      name:true,
      }
    }
  });
  return plans;
}

export const createPlanService = async (data: IPlan & {createdBy: string}) => {
 const {createdBy, ...dataBody} = data;

 const existPlan = await planRepository.findOneBy({name: dataBody.name});
 if(existPlan) {
  throw new AppError('Plan ya existe', 400);
 };
  const plan: ICreatePlan= planRepository.create({
    ...dataBody,
    createdBy: {id: createdBy}
  });
  const savePlan = await planRepository.save(plan);
  const planRelation = await planRepository.findOne({
   where: { id: savePlan.id },
   relations:{ createdBy: true},
   select: {
    id:true,
    name:true,
    description:true,
    deliverables:true,
    priceRange:true,
    isActive: true,
    createdBy: {
      id:true,
      name:true,
      }
   }
  });
  return planRelation;
}

export const updatePlanService = async (id: string, dataBody: Partial<IPlan>) => {
  const plan = await planRepository.findOneBy({id});
  if(!plan) {
    throw new AppError('Plan no encontrado', 404);
  };
  const upPlan = planRepository.merge(plan, dataBody);
  const updatePlan = await planRepository.save(upPlan);
  return updatePlan;
};

export const deletePlanService = async (id: string) => {
  const plan = await planRepository.findOneBy({id});
  if(!plan) {
    throw new AppError('Plan no encontrado', 404);
  };
  const deletePlan = await planRepository.remove(plan);
  return {
    message:'Plan eliminado',
    deletePlan: deletePlan
  }
};
