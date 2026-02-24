import { create } from 'zustand';
import { DietRecordData } from '../types';

interface DietState {
  currentDraft: DietRecordData | null;
  setDraft: (draft: DietRecordData) => void;
  clearDraft: () => void;
}

export const useDietStore = create<DietState>((set) => ({
  currentDraft: null,

  setDraft: (draft) => {
    set({ currentDraft: draft });
  },

  clearDraft: () => {
    set({ currentDraft: null });
  },
}));
