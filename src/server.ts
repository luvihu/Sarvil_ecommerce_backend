import express from 'express';
import router from './routes/index';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(morgan('dev'));
app.use(router);
app.use(errorHandler);

export default app;
