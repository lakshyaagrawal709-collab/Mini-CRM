const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['CREATED', 'UPDATED', 'STATUS_CHANGE', 'NOTE_ADDED', 'DELETED', 'BULK_IMPORT']
    },
    details: {
      type: String,
      required: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null
    },
    leadName: {
      type: String,
      default: ''
    },
    performedBy: {
      type: String,
      default: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
