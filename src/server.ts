import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp());

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5010;

const server = app.listen(PORT, () =>
  console.log(`Server is running on port: ${PORT}`)
);

// Hantera fel(Rejections) som inte hanteras någon annanstans i applikation...
process.on('unhandledRejection', (err: Error, promise) => {
  console.log(`FEL: ${err.message}`);
  server.close(() => process.exit(1));
});
