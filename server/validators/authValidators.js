const { body } = require('express-validator');

exports.registerValidator = [
  body('userName')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .escape(), // prevents script injection

  body('email')
    .trim()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

  body('password')
    .trim()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidator = [
  body('email')
    .trim()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];
