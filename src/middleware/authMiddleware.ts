import { Request, Response, NextFunction } from "express";
import { verifytoken } from "../services/authService";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
 const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifytoken(token);
    (req as any).user = decoded; // Adjuntamos el payload del JWT
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};



