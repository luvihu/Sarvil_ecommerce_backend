import { Request, Response } from "express";
import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";
import { comparedPassword, generateToken, hashPassword } from "../services/authService";
import { IRegisterUser } from '../interfaces/Interfaces';
import validator from 'validator';

const userRepository = AppDataSource.getRepository(User);

export const login = async (req:Request, res: Response) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
 
  if(!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  };
  const user = await userRepository.findOne({ 
    where: { email: normalizedEmail },
    select: ["id", "email", "password", "role", "isActive"]
  });

  if(!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid email or password" });
  };
  
  const isValid = await comparedPassword(password, user.password);
  if(!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  };

  const token = generateToken(user.id, user.email);
  return res.status(200).json({ 
    token, 
    user: { id: user.id, email: user.email, role: user.role } 
  });
}

export const registerUser = async (req:Request, res: Response) => {
  const userData: IRegisterUser = req.body;
  if(!userData.name || !userData.email || !userData.password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  };
  if(!validator.isEmail(userData.email)) {
    return res.status(400).json({ message: "Email invalido" });
  };
  const normalizedData = {
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    };

  const user = await userRepository.findOne({ where: { email: normalizedData.email } });
  if(user) {
    return res.status(400).json({ message: "User already exists" });
  };
  
  const hashedPassword = await hashPassword(userData.password);
  const newUser = userRepository.create({
   ...normalizedData,
    password: hashedPassword,
  });
  await userRepository.save(newUser);
  return res.status(201).json({ message: "User registered successfully" });
}

export const allUserAdmin = async (req: Request, res: Response) => {
  const allUser = await userRepository.find();
  return res.status(200).json(allUser);
};


