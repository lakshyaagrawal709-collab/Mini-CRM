const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  importLeadsCSV
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { validateLead, validateNote } = require('../middleware/validateMiddleware');

// All lead routes are protected by JWT authentication
router.use(protect);

router.get('/', getLeads);
router.post('/', validateLead, createLead);
router.post('/import', importLeadsCSV);
router.get('/:id', getLeadById);
router.put('/:id', validateLead, updateLead);
router.delete('/:id', deleteLead);
router.patch('/status/:id', updateLeadStatus);
router.patch('/notes/:id', validateNote, addLeadNote);

module.exports = router;
