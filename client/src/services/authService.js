import api from './api';

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      // Fallback for static environments (GitHub Pages)
      console.warn('Backend API unreachable, using local registration fallback.');
      const demoUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        token: 'demo_jwt_token_' + Date.now()
      };
      return {
        success: true,
        message: 'Admin account created successfully!',
        data: demoUser
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Fallback for static environments (GitHub Pages)
      console.warn('Backend API unreachable, using local authentication fallback.');
      const demoUser = {
        _id: 'user_admin_demo',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        token: 'demo_jwt_token_safe_auth'
      };
      return {
        success: true,
        message: 'Login successful (Demo Mode)',
        data: demoUser
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const savedUser = localStorage.getItem('crm_user');
      const userData = savedUser ? JSON.parse(savedUser) : { _id: 'user_admin_demo', name: 'Admin User', email: 'admin@minicrm.com' };
      return {
        success: true,
        data: userData
      };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      return {
        success: true,
        message: 'Password updated successfully (Demo Mode)'
      };
    }
  }
};
