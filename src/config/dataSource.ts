import { DataSource } from "typeorm";
import "dotenv/config";
import { Inquiry } from "../entities/Inquiry";
import { Plan } from "../entities/Plan";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Image } from "../entities/Image";
import { Video } from "../entities/Video";

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(isProduction 
    ? {
      url: process.env.DATABASE_URL, 
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: !isProduction,
    }
  : {
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
    synchronize:true
  }
  ),
  logging: false,
  entities: [Inquiry, Plan, Project, User, Image, Video],
});


// import { DataSource } from "typeorm";
// import "dotenv/config";
// import { Inquiry } from "../entities/Inquiry";
// import { Plan } from "../entities/Plan";
// import { Project } from "../entities/Project";
// import { User } from "../entities/User";
// import { Image } from "../entities/Image";
// import { Video } from "../entities/Video";


// export const AppDataSource = new DataSource({
//   type: "postgres",
//   url: process.env.DATABASE_URL, // Render usa esta variable
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   synchronize: false,
//   logging: false,
//   entities: [Inquiry, Plan, Project, User, Image, Video],
// });


// import { DataSource } from "typeorm";
// import "dotenv/config";
// import { Inquiry } from "../entities/Inquiry";
// import { Plan } from "../entities/Plan";
// import { Project } from "../entities/Project";
// import { User } from "../entities/User";
// import { Image } from "../entities/Image";
// import { Video } from "../entities/Video";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST || "localhost",
//   port: 5432,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: process.env.NODE_ENV === 'production'
//     ? { rejectUnauthorized: false } // Render usa cert autofirmado en free tier
//     : false,
//   synchronize: false, // solo para desarrollo es true, en producccion es false
//   logging:false, 
//   entities: [Inquiry, Plan, Project, User, Image, Video],
//   extra: {
//     connectionTimeoutMillis: 10000,
//     max: 5, // Límite de conexiones
//   },
// });