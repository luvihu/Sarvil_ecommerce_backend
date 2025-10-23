import { Router} from "express";
import { login, registerUser, allUserAdmin } from "../controllers/authController";

const routerAuth = Router();

routerAuth.post('/login', login);
routerAuth.post('/register', registerUser);
routerAuth.get('/user', allUserAdmin);

export default routerAuth;

