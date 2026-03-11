// src/components/chatbot/services/chat-api.ts

import { ChatMessage, ChatSession } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/chat';

export const chatApi = {
  async startSession(title?: string): Promise<ChatSession> {
    const url = title ? `${API_BASE_URL}/start?title=${encodeURIComponent(title)}` : `${API_BASE_URL}/start`;
    const response = await fetch(url, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to start chat session');
    }
    return response.json();
  },

  async getAllSessions(): Promise<ChatSession[]> {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    if (!response.ok) {
      throw new Error('Failed to get all sessions');
    }
    return response.json();
  },

  async getConversation(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`);
    if (!response.ok) {
      throw new Error(`Failed to get conversation for session ${sessionId}`);
    }
    return response.json();
  },

  async sendUserMessage(sessionId: string, userPrompt: string): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/${sessionId}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: userPrompt,
    });
    if (!response.ok) {
      throw new Error('Failed to send user message');
    }
    return response.json();
  },

  async sendBotMessage(sessionId: string, botContent: string): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/${sessionId}/bot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: botContent,
    });
    if (!response.ok) {
        throw new Error('Failed to send bot message');
    }
    return response.json();
  },
};
