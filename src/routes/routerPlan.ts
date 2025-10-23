import { Router} from "express";
import { allPlan, createPlan, updatePlan, deletePlan } from '../controllers/planController';
import { authMiddleware, } from '../middleware/authMiddleware';

const routerPlan = Router();

routerPlan.get('/', allPlan);

routerPlan.post('/create', authMiddleware,  createPlan);
routerPlan.put('/:id', authMiddleware,  updatePlan);
routerPlan.delete('/:id', authMiddleware,  deletePlan);

export default routerPlan;
