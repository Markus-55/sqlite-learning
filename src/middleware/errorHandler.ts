import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../models/ErrorResponse.js';

interface ExtendedError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
}


export const errorHandler = (err: ExtendedError, req: Request, res: Response, next: NextFunction): void => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `The resourse could not be found.`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `The resourse already exists.`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {}).map((value) => value.message);
    error = new ErrorResponse(`Information missing: ${message}`, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Server Error',
  });
};
