const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('name').notEmpty().withMessage('Full name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email address').trim(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateLead = [
  body('name').notEmpty().withMessage('Lead name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email address').trim(),
  body('phone').optional().isString().trim(),
  body('company').optional().isString().trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Social Media', 'Other'])
    .withMessage('Invalid source value'),
  handleValidationErrors
];

const validateNote = [
  body('text').notEmpty().withMessage('Note text cannot be empty').trim(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateLead,
  validateNote
};
