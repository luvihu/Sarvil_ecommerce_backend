import { Router} from "express";
import {  addImagesToProject, getProjectImages, deleteImage, updateImage } from "../controllers/imageController";
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadProjectImages } from '../middleware/uploadProjectImages';

const routerImage = Router();

routerImage.get('/:projectId/images', getProjectImages);
routerImage.post('/:projectId/images', authMiddleware, uploadProjectImages, addImagesToProject);
routerImage.put('/:imageId', authMiddleware, uploadProjectImages, updateImage);
routerImage.delete('/:imageId', authMiddleware, deleteImage);


export default routerImage;