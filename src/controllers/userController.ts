import { Request, Response, NextFunction } from "express";
import { sqlDatabase } from "../connectDB.js";
import ErrorResponse from "../models/ErrorResponse.js";
import ResponseModel from "../models/ResponseModel.js";
import { User } from "../models/UserModel.js";
import { generateToken, hashPassword } from "../utils/security.js";
import { executeQuery, fetchSingleRow } from "../utils/sqlQueries.js";

// @desc    Register a user
// @route   POST /api/auth/register
// @access  ADMIN
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { producerID, company, role, fullName, email, password } = req.body;

  if(!fullName || !email || !password) {
    return next(
      new ErrorResponse('Name, email or password is missing', 400)
    );
  }

  const sqlInsertUser: string = `INSERT INTO
    Users (ProducerID, Company, Role, FullName, Email, Password)
    VALUES (?, ?, ?, ?, ?, ?)`

  const sqlSelectEmail = 'SELECT * FROM Users WHERE email = ?';
  
  try {
    const user: User = {
      producerID,
      company,
      role,
      fullName,
      email,
      password
    };

    const hashedPassword: string = await hashPassword(user.password);

    const userExists = await fetchSingleRow<User>(sqlDatabase, sqlSelectEmail, [user.email]);

    if(userExists) {
      return next(
        new ErrorResponse('Account already exist', 400)
      );
    }

    await executeQuery<string | number | undefined>(sqlDatabase, sqlInsertUser, [
      user.producerID,
      user.company,
      user.role,
      user.fullName,
      user.email,
      hashedPassword
    ]);
    
    createAndSendToken(user, 201, res);
  } catch (err) {
    return next(new ErrorResponse(`Registration failed with ${err}`, 500));
  }
}

// Generate the JWT token
const createAndSendToken = (user: User, statusCode: number, res: Response): void => {
  const token: string = generateToken(user.userID!, user.role);
  
  // Ensure JWT_COOKIE_TTL is defined and valid
  const cookieTTL: number = Number(process.env.JWT_COOKIE_TTL);

  const options: object = {
    expires: new Date(
      Date.now() + cookieTTL * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json(new ResponseModel({
      statusCode,
      data: token,
    })
  );
}
