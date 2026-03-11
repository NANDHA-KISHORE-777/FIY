package com.confluence.sih.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.confluence.sih.model.ChatSession;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID>{
    
}
