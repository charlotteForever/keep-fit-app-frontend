import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolStatus?: string; // 工具调用中间状态提示
}

interface ChatStore {
  messages: Message[];
  conversationId: string | undefined;
  isLoading: boolean;
  addUserMessage: (content: string) => string;
  startAssistantMessage: () => string;
  appendToken: (id: string, token: string) => void;
  setToolStatus: (id: string, status: string) => void;
  finishAssistantMessage: (id: string) => void;
  setConversationId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

let msgCounter = 0;
const genId = () => `msg_${++msgCounter}_${Date.now()}`;

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  conversationId: undefined,
  isLoading: false,

  addUserMessage: (content) => {
    const id = genId();
    set((s) => ({ messages: [...s.messages, { id, role: 'user', content }] }));
    return id;
  },

  startAssistantMessage: () => {
    const id = genId();
    set((s) => ({
      messages: [...s.messages, { id, role: 'assistant', content: '', isStreaming: true }],
    }));
    return id;
  },

  appendToken: (id, token) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + token, toolStatus: undefined } : m,
      ),
    }));
  },

  setToolStatus: (id, status) => {
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, toolStatus: status } : m)),
    }));
  },

  finishAssistantMessage: (id) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false, toolStatus: undefined } : m,
      ),
    }));
  },

  setConversationId: (id) => set({ conversationId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ messages: [], conversationId: undefined, isLoading: false }),
}));
