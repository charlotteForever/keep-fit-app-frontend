import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  updateReference: async (dietReference: any) => {
    const response = await api.put('/user/reference', { dietReference });
    return response.data;
  },
};

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getWeeklyTrend: async () => {
    const response = await api.get('/dashboard/trend/weekly');
    return response.data;
  },

  getMonthlyTrend: async () => {
    const response = await api.get('/dashboard/trend/monthly');
    return response.data;
  },
};
