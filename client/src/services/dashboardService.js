import api from './api';
import { getStoredLeads } from './mockData';

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Backend API unreachable, compiling dashboard metrics from stored dataset.');
      const leads = getStoredLeads();
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(l => l.status === 'Converted').length;
      const lostLeads = leads.filter(l => l.status === 'Lost').length;
      const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
      const newLeads = leads.filter(l => l.status === 'New').length;
      const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
      const proposalSentLeads = leads.filter(l => l.status === 'Proposal Sent').length;

      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';
      const totalRevenue = leads
        .filter(l => l.status === 'Converted')
        .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

      const statusDistribution = [
        { name: 'New', count: newLeads, color: '#3B82F6' },
        { name: 'Contacted', count: contactedLeads, color: '#8B5CF6' },
        { name: 'Qualified', count: qualifiedLeads, color: '#06B6D4' },
        { name: 'Proposal Sent', count: proposalSentLeads, color: '#F59E0B' },
        { name: 'Converted', count: convertedLeads, color: '#10B981' },
        { name: 'Lost', count: lostLeads, color: '#EF4444' }
      ];

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyLeads = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const m = d.getMonth();
        monthlyLeads.push({
          month: monthNames[m],
          total: Math.max(1, Math.floor(totalLeads / (i + 1))),
          converted: Math.max(0, Math.floor(convertedLeads / (i + 1)))
        });
      }

      const recentLeads = leads.slice(0, 5);
      const upcomingFollowUps = leads
        .filter(l => l.followUpDate)
        .slice(0, 5);

      const recentActivities = [
        { _id: 'act_1', action: 'CREATED', details: 'System initialized with demo leads', performedBy: 'Demo System', createdAt: new Date().toISOString() },
        { _id: 'act_2', action: 'STATUS_CHANGE', details: 'Changed status of Sarah Jenkins to Converted', performedBy: 'Alex Rivera', createdAt: new Date().toISOString() }
      ];

      return {
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
      };
    }
  }
};
