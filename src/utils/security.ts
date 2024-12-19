import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_TTL,
  });
}

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 12);
}

export const validatePassword = async (passwordToCheck: string, userPassword: string) => {
  return await bcrypt.compare(passwordToCheck, userPassword);
}
