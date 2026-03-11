package com.confluence.sih.mapper;

import com.confluence.sih.dto.chat.SessionDetails;
import com.confluence.sih.dto.chat.MessageDetails;
import com.confluence.sih.model.ChatSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class SessionMapper {

    @Autowired
    private MessageMapper messageMapper;

    public SessionDetails toDto(ChatSession entity) {
        List<MessageDetails> messageDtos = entity.getMessages() == null ?
                List.of() :
                entity.getMessages().stream()
                        .map(messageMapper::toDto)
                        .toList();

        return SessionDetails.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .createdAt(entity.getCreatedAt()
                        .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .messages(messageDtos)
                .build();
    }
}
