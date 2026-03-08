import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../constants/config';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface SSEEvent {
  type: 'token' | 'tool_call' | 'tool_result' | 'done' | 'error';
  data: any;
}

export const aiService = {
  streamChat: async (
    message: string,
    conversationId: string | undefined,
    onEvent: (event: SSEEvent) => void,
  ): Promise<void> => {
    const token = useAuthStore.getState().token;

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, conversationId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const rawData = line.slice(6).trim();
          try {
            const data = JSON.parse(rawData);
            onEvent({ type: eventType as SSEEvent['type'], data });
          } catch {}
        }
      }
    }
  },

  getConversations: async () => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE_URL}/ai/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE_URL}/ai/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  deleteConversation: async (conversationId: string) => {
    const token = useAuthStore.getState().token;
    await fetch(`${API_BASE_URL}/ai/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
