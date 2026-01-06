import rateLimit from 'express-rate-limit';

export const createProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later',
});

export const deleteProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 delete requests per windowMs
  message: 'Too many delete requests, please try again later',
});