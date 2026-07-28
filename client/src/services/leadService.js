import api from './api';
import { getStoredLeads, setStoredLeads } from './mockData';

export const leadService = {
  getLeads: async (params = {}) => {
    try {
      const response = await api.get('/leads', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend API unreachable, using local storage lead dataset.');
      let leads = getStoredLeads();
      const { search, status, priority, source, sort = 'newest', page = 1, limit = 10, exportData } = params;

      // Filter by search
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        leads = leads.filter(l => regex.test(l.name) || regex.test(l.email) || regex.test(l.company));
      }

      // Filter by status
      if (status && status !== 'All') {
        leads = leads.filter(l => l.status === status);
      }

      // Filter by priority
      if (priority && priority !== 'All') {
        leads = leads.filter(l => l.priority === priority);
      }

      // Filter by source
      if (source && source !== 'All') {
        leads = leads.filter(l => l.source === source);
      }

      // Sort
      if (sort === 'oldest') {
        leads.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === 'name') {
        leads.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'value') {
        leads.sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));
      } else {
        leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      if (exportData === 'true') {
        return { success: true, data: leads };
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const total = leads.length;
      const paginated = leads.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return {
        success: true,
        data: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      };
    }
  },

  getLeadById: async (id) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const lead = leads.find(l => l._id === id);
      return { success: true, data: lead || leads[0] };
    }
  },

  createLead: async (leadData) => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const newLead = {
        _id: 'lead_' + Date.now(),
        ...leadData,
        createdAt: new Date().toISOString(),
        notes: leadData.notes ? [{ text: leadData.notes, author: 'Admin', createdAt: new Date().toISOString() }] : []
      };
      setStoredLeads([newLead, ...leads]);
      return { success: true, message: 'Lead created successfully (Demo Mode)', data: newLead };
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const updated = leads.map(l => l._id === id ? { ...l, ...leadData } : l);
      setStoredLeads(updated);
      return { success: true, message: 'Lead updated successfully (Demo Mode)' };
    }
  },

  deleteLead: async (id) => {
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const filtered = leads.filter(l => l._id !== id);
      setStoredLeads(filtered);
      return { success: true, message: 'Lead deleted successfully (Demo Mode)' };
    }
  },

  updateLeadStatus: async (id, status) => {
    try {
      const response = await api.patch(`/leads/status/${id}`, { status });
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const updated = leads.map(l => l._id === id ? { ...l, status } : l);
      setStoredLeads(updated);
      return { success: true, message: `Status updated to ${status} (Demo Mode)` };
    }
  },

  addLeadNote: async (id, text) => {
    try {
      const response = await api.patch(`/leads/notes/${id}`, { text });
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const updated = leads.map(l => {
        if (l._id === id) {
          const notes = l.notes || [];
          return { ...l, notes: [{ text, author: 'Admin', createdAt: new Date().toISOString() }, ...notes] };
        }
        return l;
      });
      setStoredLeads(updated);
      return { success: true, message: 'Note added successfully (Demo Mode)' };
    }
  },

  importLeadsCSV: async (leadsArray) => {
    try {
      const response = await api.post('/leads/import', { leads: leadsArray });
      return response.data;
    } catch (error) {
      const leads = getStoredLeads();
      const formatted = leadsArray.map((l, idx) => ({
        _id: 'lead_import_' + Date.now() + '_' + idx,
        name: l.name,
        email: l.email,
        phone: l.phone || '',
        company: l.company || 'N/A',
        source: l.source || 'Other',
        status: l.status || 'New',
        priority: l.priority || 'Medium',
        estimatedValue: l.estimatedValue ? Number(l.estimatedValue) : 0,
        createdAt: new Date().toISOString(),
        notes: []
      }));
      setStoredLeads([...formatted, ...leads]);
      return {
        success: true,
        message: `Successfully imported ${formatted.length} leads (Demo Mode)`
      };
    }
  },

  exportLeadsCSV: async (params = {}) => {
    return leadService.getLeads({ ...params, exportData: 'true' });
  }
};
