const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_crm';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Database connected...');

    // Clear existing data
    await Admin.deleteMany({});
    await Lead.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('[Seed] Cleared old records...');

    // Create default Admin
    const admin = await Admin.create({
      name: 'Alex Rivera',
      email: 'admin@minicrm.com',
      password: 'admin123'
    });
    console.log('[Seed] Created default admin: admin@minicrm.com / admin123');

    // Create sample leads with dates spread over the last 5 months
    const now = new Date();
    
    const sampleLeads = [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@acmecorp.io',
        phone: '+1 (555) 234-5678',
        company: 'Acme Technologies',
        source: 'Website',
        status: 'Converted',
        priority: 'High',
        estimatedValue: 24500,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Inquired about enterprise custom software development package.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 118 * 24 * 60 * 60 * 1000) },
          { text: 'Proposal sent and accepted! Signed contract.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'David Chen',
        email: 'david@vertexsolutions.com',
        phone: '+1 (555) 876-5432',
        company: 'Vertex Solutions',
        source: 'LinkedIn',
        status: 'Proposal Sent',
        priority: 'High',
        estimatedValue: 18000,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Sent formal SLA and project timeline proposal.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'Elena Rostova',
        email: 'elena@cyberpulse.net',
        phone: '+1 (555) 345-6789',
        company: 'CyberPulse Systems',
        source: 'Referral',
        status: 'Qualified',
        priority: 'Medium',
        estimatedValue: 12500,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Passed technical discovery call. Next step: demo session.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@nexustech.co',
        phone: '+1 (555) 901-2345',
        company: 'Nexus Tech Co',
        source: 'Cold Call',
        status: 'Contacted',
        priority: 'Low',
        estimatedValue: 8000,
        assignedTo: 'Sales Team',
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Left voicemail with introductory pitch deck link.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'Jessica Taylor',
        email: 'jessica@brightpath.org',
        phone: '+1 (555) 432-1098',
        company: 'Brightpath Digital',
        source: 'Website',
        status: 'New',
        priority: 'High',
        estimatedValue: 35000,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        notes: []
      },
      {
        name: 'Robert Sterling',
        email: 'robert@sterlingcapital.com',
        phone: '+1 (555) 654-3210',
        company: 'Sterling Capital',
        source: 'Social Media',
        status: 'Converted',
        priority: 'High',
        estimatedValue: 42000,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Full mobile app design and API backend contract executed.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'Amara Okafor',
        email: 'amara@solargreen.africa',
        phone: '+1 (555) 888-9999',
        company: 'SolarGreen Global',
        source: 'Referral',
        status: 'Lost',
        priority: 'Medium',
        estimatedValue: 15000,
        assignedTo: 'Sales Team',
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Budget frozen for Q3. Lead postponed indefinitely.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        name: 'Liam Gallagher',
        email: 'liam@oasisdigital.uk',
        phone: '+44 20 7946 0912',
        company: 'Oasis Digital UK',
        source: 'Website',
        status: 'Proposal Sent',
        priority: 'Medium',
        estimatedValue: 22000,
        assignedTo: 'Alex Rivera',
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        notes: [
          { text: 'Proposal delivered via email. Waiting on board review.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) }
        ]
      }
    ];

    const insertedLeads = await Lead.insertMany(sampleLeads);
    console.log(`[Seed] Inserted ${insertedLeads.length} sample leads`);

    // Create initial audit log entries
    const initialLogs = [
      {
        action: 'CREATED',
        details: 'System initialized with demo leads and admin user',
        performedBy: 'System Seed'
      },
      {
        action: 'STATUS_CHANGE',
        details: 'Changed status of Sarah Jenkins from "Proposal Sent" to "Converted"',
        leadId: insertedLeads[0]._id,
        leadName: insertedLeads[0].name,
        performedBy: 'Alex Rivera'
      },
      {
        action: 'NOTE_ADDED',
        details: 'Added a new note for lead: David Chen',
        leadId: insertedLeads[1]._id,
        leadName: insertedLeads[1].name,
        performedBy: 'Alex Rivera'
      }
    ];

    await ActivityLog.insertMany(initialLogs);
    console.log('[Seed] Created initial activity logs');

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
