import { body, validationResult } from 'express-validator';

export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&().,]+$/)
    .withMessage('Product name contains invalid characters')
    .escape(),
  
  body('category')
    .isIn(['Innerwear', 'Clothing'])
    .withMessage('Invalid category selected'),
  
  body('price')
    .isFloat({ min: 1, max: 999999 })
    .withMessage('Price must be between 1 and 999999')
    .toFloat(),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .matches(/^[a-zA-Z0-9\s\-&().,!?]+$/)
    .withMessage('Description contains invalid characters')
    .escape(),
  
  body('image')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Invalid image URL')
    .isLength({ max: 500 })
    .withMessage('Image URL too long'),
];

export const handleProductValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};