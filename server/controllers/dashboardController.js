const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get dashboard analytics & aggregated metrics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const proposalSentLeads = await Lead.countDocuments({ status: 'Proposal Sent' });

    // Calculate Conversion Rate
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

    // Calculate Estimated Revenue from Converted Leads
    const convertedDocs = await Lead.find({ status: 'Converted' }, 'estimatedValue');
    const totalRevenue = convertedDocs.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

    // Status breakdown for Pie Chart
    const statusDistribution = [
      { name: 'New', count: newLeads, color: '#3B82F6' },
      { name: 'Contacted', count: contactedLeads, color: '#8B5CF6' },
      { name: 'Qualified', count: qualifiedLeads, color: '#06B6D4' },
      { name: 'Proposal Sent', count: proposalSentLeads, color: '#F59E0B' },
      { name: 'Converted', count: convertedLeads, color: '#10B981' },
      { name: 'Lost', count: lostLeads, color: '#EF4444' }
    ];

    // Monthly lead count aggregation for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyAggregate = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format monthly data for Recharts Bar chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyLeads = [];
    
    // Fill in last 6 months structure ensuring non-empty bars
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const found = monthlyAggregate.find(item => item._id.month === (m + 1) && item._id.year === y);
      monthlyLeads.push({
        month: monthNames[m],
        total: found ? found.count : 0,
        converted: found ? found.converted : 0
      });
    }

    // Recent 5 leads
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email company status priority createdAt estimatedValue');

    // Upcoming follow-ups (next 10 days or any pending follow-up date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingFollowUps = await Lead.find({
      followUpDate: { $gte: today }
    })
      .sort({ followUpDate: 1 })
      .limit(5)
      .select('name company followUpDate status priority phone');

    // Recent activity log feed
    const recentActivities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        summary: {
          totalLeads,
          convertedLeads,
          lostLeads,
          contactedLeads,
          newLeads,
          qualifiedLeads,
          proposalSentLeads,
          conversionRate,
          totalRevenue
        },
        statusDistribution,
        monthlyLeads,
        recentLeads,
        upcomingFollowUps,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
