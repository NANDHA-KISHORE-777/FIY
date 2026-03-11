package com.confluence.sih.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.confluence.sih.dto.chat.MessageDetails;
import com.confluence.sih.dto.query.QueryDetails;
import com.confluence.sih.model.ChatMessage;
import com.confluence.sih.service.query.QueryService;

@Component
public class MessageMapper {

    @Autowired
    private QueryService queryService;

    public MessageDetails toDto(ChatMessage entity) {
        List<Map<String, Object>> queryOutput = null;
        if (entity.getQuery() != null && !entity.getQuery().isBlank()) {
            queryOutput = queryService.runSelectQuery(entity.getQuery());
        }
        return MessageDetails.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .sender(entity.getSender())
                .createdAt(entity.getCreatedAt())
                .queryDetails(QueryDetails.builder()
                        .query(entity.getQuery())
                        .queryOutput(queryOutput)
                        .build())
                .reportId(entity.getReportId())
                .report(entity.getReport())
                .build();
    }
}
