import api from './api';

export const leadService = {
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/status/${id}`, { status });
    return response.data;
  },

  addLeadNote: async (id, text) => {
    const response = await api.patch(`/leads/notes/${id}`, { text });
    return response.data;
  },

  importLeadsCSV: async (leadsArray) => {
    const response = await api.post('/leads/import', { leads: leadsArray });
    return response.data;
  },

  exportLeadsCSV: async (params = {}) => {
    const response = await api.get('/leads', { params: { ...params, exportData: 'true' } });
    return response.data;
  }
};
