const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all leads with search, filtering, sorting, pagination, or export
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      source,
      sort = 'newest',
      page = 1,
      limit = 10,
      exportData = false
    } = req.query;

    const query = {};

    // Search filter across name, email, company
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex }
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Source filter
    if (source && source !== 'All') {
      query.source = source;
    }

    // Sort order
    let sortOptions = {};
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'name') {
      sortOptions = { name: 1 };
    } else if (sort === 'value') {
      sortOptions = { estimatedValue: -1 };
    } else {
      sortOptions = { createdAt: -1 }; // newest default
    }

    // CSV export returns unpaginated matching leads
    if (exportData === 'true') {
      const leads = await Lead.find(query).sort(sortOptions);
      return res.json({ success: true, data: leads });
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalLeads / limitNum);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total: totalLeads,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages || 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status, priority, notes, followUpDate, assignedTo, estimatedValue } = req.body;

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({ success: false, message: 'A lead with this email address already exists' });
    }

    const leadNotes = [];
    if (notes) {
      leadNotes.push({
        text: notes,
        author: req.admin ? req.admin.name : 'Admin',
        createdAt: new Date()
      });
    }

    const newLead = await Lead.create({
      name,
      email,
      phone: phone || '',
      company: company || 'N/A',
      source: source || 'Website',
      status: status || 'New',
      priority: priority || 'Medium',
      notes: leadNotes,
      followUpDate: followUpDate || null,
      assignedTo: assignedTo || 'Sales Team',
      estimatedValue: estimatedValue ? Number(estimatedValue) : 0
    });

    // Create activity log
    await ActivityLog.create({
      action: 'CREATED',
      details: `Created new lead: ${name} (${company || 'No Company'})`,
      leadId: newLead._id,
      leadName: newLead.name,
      performedBy: req.admin ? req.admin.name : 'Admin'
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const { name, email, phone, company, source, status, priority, followUpDate, assignedTo, estimatedValue } = req.body;

    lead.name = name || lead.name;
    lead.email = email || lead.email;
    lead.phone = phone !== undefined ? phone : lead.phone;
    lead.company = company || lead.company;
    lead.source = source || lead.source;
    lead.status = status || lead.status;
    lead.priority = priority || lead.priority;
    lead.followUpDate = followUpDate !== undefined ? followUpDate : lead.followUpDate;
    lead.assignedTo = assignedTo || lead.assignedTo;
    lead.estimatedValue = estimatedValue !== undefined ? Number(estimatedValue) : lead.estimatedValue;

    const updatedLead = await lead.save();

    await ActivityLog.create({
      action: 'UPDATED',
      details: `Updated details for lead: ${updatedLead.name}`,
      leadId: updatedLead._id,
      leadName: updatedLead.name,
      performedBy: req.admin ? req.admin.name : 'Admin'
    });

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const leadName = lead.name;
    await Lead.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      action: 'DELETED',
      details: `Deleted lead: ${leadName}`,
      leadName: leadName,
      performedBy: req.admin ? req.admin.name : 'Admin'
    });

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update status of lead
// @route   PATCH /api/leads/status/:id
// @access  Private
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await ActivityLog.create({
      action: 'STATUS_CHANGE',
      details: `Changed status of ${lead.name} from "${oldStatus}" to "${status}"`,
      leadId: lead._id,
      leadName: lead.name,
      performedBy: req.admin ? req.admin.name : 'Admin'
    });

    res.json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a note to lead timeline
// @route   PATCH /api/leads/notes/:id
// @access  Private
const addLeadNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const authorName = req.admin ? req.admin.name : 'Admin';
    lead.notes.push({
      text,
      author: authorName,
      createdAt: new Date()
    });

    await lead.save();

    await ActivityLog.create({
      action: 'NOTE_ADDED',
      details: `Added a new note for lead: ${lead.name}`,
      leadId: lead._id,
      leadName: lead.name,
      performedBy: authorName
    });

    res.json({
      success: true,
      message: 'Note added successfully',
      data: lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk import leads from parsed CSV array
// @route   POST /api/leads/import
// @access  Private
const importLeadsCSV = async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid leads provided for import' });
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const leadData of leads) {
      if (!leadData.name || !leadData.email) {
        skippedCount++;
        continue;
      }

      const existing = await Lead.findOne({ email: leadData.email.toLowerCase() });
      if (existing) {
        skippedCount++;
        continue;
      }

      await Lead.create({
        name: leadData.name,
        email: leadData.email.toLowerCase(),
        phone: leadData.phone || '',
        company: leadData.company || 'N/A',
        source: leadData.source || 'Other',
        status: leadData.status || 'New',
        priority: leadData.priority || 'Medium',
        estimatedValue: leadData.estimatedValue ? Number(leadData.estimatedValue) : 0,
        assignedTo: leadData.assignedTo || 'Sales Team'
      });
      insertedCount++;
    }

    await ActivityLog.create({
      action: 'BULK_IMPORT',
      details: `Imported ${insertedCount} new leads via CSV (${skippedCount} skipped)`,
      performedBy: req.admin ? req.admin.name : 'Admin'
    });

    res.json({
      success: true,
      message: `Successfully imported ${insertedCount} leads (${skippedCount} duplicates/invalid skipped)`,
      insertedCount,
      skippedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  importLeadsCSV
};
