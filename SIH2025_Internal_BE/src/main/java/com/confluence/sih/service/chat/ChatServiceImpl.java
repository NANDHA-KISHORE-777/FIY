package com.confluence.sih.service.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.confluence.sih.common.enums.SenderType;
import com.confluence.sih.model.ChatMessage;
import com.confluence.sih.model.ChatSession;
import com.confluence.sih.model.Report;
import com.confluence.sih.repository.ChatMessageRepository;
import com.confluence.sih.repository.ChatSessionRepository;
import com.confluence.sih.repository.ReportRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public ChatSession startSession(String title) {
        ChatSession session = new ChatSession();
        session.setTitle(title != null ? title : "New Conversation");
        return chatSessionRepository.save(session);
    }

    @Override
    public ChatMessage addUserMessage(UUID sessionId, String content) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        ChatMessage msg = new ChatMessage();
        msg.setSender(SenderType.USER);
        msg.setContent(content);
        msg.setSession(session);

        return chatMessageRepository.save(msg);
    }

    @Override
    public ChatMessage addBotMessage(UUID sessionId, String content, String reportUrl, String query) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        ChatMessage msg;
        try{
            if (query == null) {
                msg = findLatestBotMessageBySessionId(sessionId);
            }
            else {
                msg = new ChatMessage();
                msg.setSender(SenderType.BOT);
                msg.setQuery(query);
                msg.setSession(session);
            }
        
        } 
        catch(Exception e){
            msg = new ChatMessage();
            msg.setSender(SenderType.BOT);
            msg.setSession(session);
        }
        msg.setContent(content);
        if (reportUrl != null) {
            Report report = new Report();
            report.setUrl(reportUrl);
            reportRepository.save(report);
            msg.setReport(report);
            msg.setReportId(report.getId().toString());
        }

        return chatMessageRepository.save(msg);
    }

    @Override
    public List<ChatMessage> getConversation(UUID sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return session.getMessages();
    }

    @Override
    public List<ChatSession> getAllSessions() {
        return chatSessionRepository.findAll();
    }

    @Override
    public ChatMessage findLatestBotMessageBySessionId(UUID sessionId) {
        return chatMessageRepository.findLatestBotMessageBySessionId(sessionId).get();
    }
}
