import * as dotenv from 'dotenv';

dotenv.config();

export const TOKENS = {
  // Token Secrets
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,

  // Token Expiration Times
  ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
};

export const BASE_URL = {
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
};
