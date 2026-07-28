const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

router.post('/register', validateRegister, registerAdmin);
router.post('/login', validateLogin, loginAdmin);
router.get('/me', protect, getAdminProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
