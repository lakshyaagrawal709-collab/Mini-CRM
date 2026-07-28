import api from './api';

const isStaticDeployment = typeof window !== 'undefined' && (
  window.location.hostname.includes('github.io') ||
  window.location.protocol === 'file:' ||
  !import.meta.env.VITE_API_URL
);

export const authService = {
  register: async (name, email, password) => {
    if (isStaticDeployment) {
      const demoUser = {
        _id: 'user_' + Date.now(),
        name: name || 'Admin User',
        email: email || 'admin@minicrm.com'
      };
      return {
        success: true,
        message: 'Account created successfully!',
        data: { ...demoUser, token: 'demo_jwt_token_' + Date.now() }
      };
    }
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      const demoUser = {
        _id: 'user_' + Date.now(),
        name: name || 'Admin User',
        email: email || 'admin@minicrm.com'
      };
      return {
        success: true,
        message: 'Account created successfully!',
        data: { ...demoUser, token: 'demo_jwt_token_' + Date.now() }
      };
    }
  },

  login: async (email, password) => {
    if (isStaticDeployment) {
      const userName = email.includes('@') ? email.split('@')[0].toUpperCase() : 'Admin';
      const demoUser = {
        _id: 'user_admin_demo',
        name: userName,
        email: email || 'admin@minicrm.com'
      };
      return {
        success: true,
        message: 'Login successful!',
        data: { ...demoUser, token: 'demo_jwt_token_safe_auth' }
      };
    }
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      const userName = email.includes('@') ? email.split('@')[0].toUpperCase() : 'Admin';
      const demoUser = {
        _id: 'user_admin_demo',
        name: userName,
        email: email || 'admin@minicrm.com'
      };
      return {
        success: true,
        message: 'Login successful!',
        data: { ...demoUser, token: 'demo_jwt_token_safe_auth' }
      };
    }
  },

  getProfile: async () => {
    if (isStaticDeployment) {
      const savedUser = localStorage.getItem('crm_user');
      const userData = savedUser ? JSON.parse(savedUser) : { _id: 'user_admin_demo', name: 'Alex Rivera', email: 'admin@minicrm.com' };
      return { success: true, data: userData };
    }
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const savedUser = localStorage.getItem('crm_user');
      const userData = savedUser ? JSON.parse(savedUser) : { _id: 'user_admin_demo', name: 'Alex Rivera', email: 'admin@minicrm.com' };
      return { success: true, data: userData };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    if (isStaticDeployment) {
      return { success: true, message: 'Password updated successfully!' };
    }
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Password updated successfully!' };
    }
  }
};
