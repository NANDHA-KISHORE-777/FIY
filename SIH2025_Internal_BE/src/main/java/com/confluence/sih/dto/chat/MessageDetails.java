package com.confluence.sih.dto.chat;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.confluence.sih.common.enums.*;
import com.confluence.sih.dto.query.QueryDetails;
import com.confluence.sih.model.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageDetails {
    private UUID id;
    private String content;
    private SenderType sender;
    private LocalDateTime createdAt;
    private QueryDetails queryDetails;
    private String reportId;
    private Report report;
}
