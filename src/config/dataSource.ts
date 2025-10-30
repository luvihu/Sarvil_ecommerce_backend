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
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  synchronize: false,  // solo para desarrollo es true, en producccion es false
  entities: [Inquiry, Plan, Project, User, Image, Video],
  extra: {
    connectionTimeoutMillis: 10000,
    max: 5, // Límite de conexiones
  },
});