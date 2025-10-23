import { Router } from "express";
import routerAuth from './routerAuth';
import routerInquiry from './routerInquiry';
import routerPlan from './routerPlan';
import routerProject from './routerProject';
import routerImage from './routerImage';
import routerVideo from './routerVideo';

const router = Router();

router.use('/auth', routerAuth);
router.use('/inquiry', routerInquiry);
router.use('/plan', routerPlan);
router.use('/project', routerProject);
router.use('/project/image', routerImage);
router.use('/project/video', routerVideo);

export default router;
