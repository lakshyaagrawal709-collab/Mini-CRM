const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');
const ActivityLog = require('./models/ActivityLog');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load env vars
dotenv.config();

// Auto-seed default admin if empty
const autoSeedIfEmpty = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('[Auto-Seed] No admin found. Creating default admin & sample leads...');
      await Admin.create({
        name: 'Alex Rivera',
        email: 'admin@minicrm.com',
        password: 'admin123'
      });

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
          notes: [
            { text: 'Passed technical discovery call. Next step: demo session.', author: 'Alex Rivera', createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) }
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
        }
      ];

      const createdLeads = await Lead.insertMany(sampleLeads);

      await ActivityLog.create({
        action: 'CREATED',
        details: 'Auto-seeded system with demo admin and sample leads',
        performedBy: 'System'
      });

      console.log('[Auto-Seed] Ready! Login with admin@minicrm.com / admin123');
    }
  } catch (err) {
    console.error('[Auto-Seed Error]:', err.message);
  }
};

// Connect to Database and trigger auto-seed check
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/testing ease
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini CRM API is operational', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
