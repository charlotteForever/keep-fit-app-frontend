import api from './api';
import { DietRecordData } from '../types';
import * as FileSystem from 'expo-file-system';

const uriToBase64 = async (uri: string): Promise<string> => {
  return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
};

export const dietService = {
  analyzeLabel: async (imageUri: string) => {
    const imageBase64 = await uriToBase64(imageUri);
    const response = await api.post('/diet/analyze/label', { imageBase64 });
    return response.data;
  },

  analyzePhoto: async (imageUri: string, referenceType?: string) => {
    const imageBase64 = await uriToBase64(imageUri);
    const response = await api.post('/diet/analyze/photo', { imageBase64, referenceType });
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
