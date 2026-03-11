package com.confluence.sih.controller;

import org.springframework.web.bind.annotation.*;

import com.confluence.sih.dto.chat.MessageDetails;
import com.confluence.sih.dto.chat.SessionDetails;
import com.confluence.sih.mapper.MessageMapper;
import com.confluence.sih.mapper.SessionMapper;
import com.confluence.sih.model.ChatMessage;
import com.confluence.sih.model.ChatSession;
import com.confluence.sih.service.chat.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;


@RestController
@CrossOrigin(origins = "http://localhost:3039")
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private MessageMapper messageMapper;

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession(@RequestParam(required = false) String title) {
        ChatSession session = chatService.startSession(title);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{sessionId}/user")
    public ResponseEntity<ChatMessage> sendUserMessage(@PathVariable UUID sessionId, @RequestBody String userPrompt) {
        ChatMessage msg = chatService.addUserMessage(sessionId, userPrompt);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<MessageDetails>> getConversation(@PathVariable UUID sessionId) {
        List<ChatMessage> messages = chatService.getConversation(sessionId);
        List<MessageDetails> messageDtos = messages.stream()
                .map(messageMapper::toDto)
                .toList();
        return ResponseEntity.ok(messageDtos);
    }

    @PostMapping("/{sessionId}/bot")
    public ResponseEntity<ChatMessage> sendBotMessage(@PathVariable UUID sessionId, @RequestBody String botContent) {
        ChatMessage msg = chatService.addBotMessage(sessionId, botContent, null, null);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionDetails>> getAllSessions() {
        List<ChatSession> sessions = chatService.getAllSessions();

        List<SessionDetails> sessionDtos = sessions.stream()
                .map(sessionMapper::toDto)
                .toList();

        return ResponseEntity.ok(sessionDtos);
    }
    
}

