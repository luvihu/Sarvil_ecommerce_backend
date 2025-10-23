import { Router} from "express";
import { allInquiry,  createInquiry } from '../controllers/inquiryController';
import { authMiddleware } from '../middleware/authMiddleware';

const routerInquiry = Router();

routerInquiry.get('/', authMiddleware, allInquiry);
routerInquiry.post('/create', createInquiry);

export default routerInquiry;
