package com.confluence.sih.service.chat;

import java.util.List;
import java.util.UUID;

import com.confluence.sih.model.ChatMessage;
import com.confluence.sih.model.ChatSession;

public interface ChatService {
    ChatSession startSession(String title);
    ChatMessage addUserMessage(UUID sessionId, String content);
    ChatMessage addBotMessage(UUID sessionId, String content, String reportUrl, String query);
    List<ChatMessage> getConversation(UUID sessionId);
    List<ChatSession> getAllSessions();
    ChatMessage findLatestBotMessageBySessionId(UUID sessionId);
}
