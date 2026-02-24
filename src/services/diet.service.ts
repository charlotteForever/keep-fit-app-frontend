import api from './api';
import { DietRecordData } from '../types';

export const dietService = {
  getUploadUrl: async (fileName: string, contentType: string) => {
    const response = await api.post('/diet/upload', { fileName, contentType });
    return response.data;
  },

  uploadImage: async (uri: string, uploadUrl: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  },

  analyzeLabel: async (imageUrl: string) => {
    const response = await api.post('/diet/analyze/label', { imageUrl });
    return response.data;
  },

  analyzePhoto: async (imageUrl: string, referenceType?: string) => {
    const response = await api.post('/diet/analyze/photo', { imageUrl, referenceType });
    return response.data;
  },

  createRecord: async (data: DietRecordData) => {
    const response = await api.post('/diet/record', data);
    return response.data;
  },

  updateRecord: async (recordId: string, data: Partial<DietRecordData>) => {
    const response = await api.put(`/diet/record/${recordId}`, data);
    return response.data;
  },

  getRecords: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/diet/records', { params });
    return response.data;
  },

  deleteRecord: async (recordId: string) => {
    const response = await api.delete(`/diet/record/${recordId}`);
    return response.data;
  },
};
