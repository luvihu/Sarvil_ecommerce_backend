import { Router} from "express";
import {  addVideosToProject, getProjectVideos, deleteVideo, updateVideo } from "../controllers/videoController";
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadProjectVideos } from '../middleware/uploadProjectVideos';
import { handleMulterError } from '../utils/errorMulter';

const routerVideo = Router();

routerVideo.post('/:projectId/videos', authMiddleware, uploadProjectVideos, handleMulterError, addVideosToProject);
routerVideo.get('/:projectId/videos', getProjectVideos);
routerVideo.put('/:videoId', authMiddleware, uploadProjectVideos, handleMulterError, updateVideo);
routerVideo.delete('/:videoId', authMiddleware, deleteVideo);


export default routerVideo;