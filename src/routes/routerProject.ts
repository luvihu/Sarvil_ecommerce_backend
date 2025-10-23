import { Router} from "express";
import { allProject, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

const routerProject = Router();

routerProject.get('/', allProject);

routerProject.post('/create', authMiddleware, createProject);
routerProject.put('/:id', authMiddleware, updateProject);
routerProject.delete('/:id', authMiddleware, deleteProject);

export default routerProject;
