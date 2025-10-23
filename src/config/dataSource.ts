import { DataSource } from "typeorm";
import "dotenv/config";
import { Inquiry } from "../entities/Inquiry";
import { Plan } from "../entities/Plan";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Image } from "../entities/Image";
import { Video } from "../entities/Video";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: false, // Solo para desarrollo limpia la DB antes de crear las tablas
  synchronize: true,  // solo para desarrollo, en producccion es false
  logging: false,
  entities: [Inquiry, Plan, Project, User, Image, Video],
  subscribers: [],
  migrations: [],
});