package com.confluence.sih.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.confluence.sih.model.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID>{
    @Query(value = "SELECT * FROM chats " +
                    "WHERE session_id = :sessionId AND sender = 'BOT' " +
                    "ORDER BY created_at DESC " +
                    "LIMIT 1", nativeQuery = true)
    Optional<ChatMessage> findLatestBotMessageBySessionId(@Param("sessionId") UUID sessionId);
}
