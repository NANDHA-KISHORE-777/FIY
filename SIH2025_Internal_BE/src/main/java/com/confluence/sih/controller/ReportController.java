package com.confluence.sih.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.confluence.sih.dto.report.ReportRequest;
import com.confluence.sih.model.ChatMessage;
import com.confluence.sih.model.Report;
import com.confluence.sih.repository.ChatMessageRepository;
import com.confluence.sih.service.chat.ChatService;
import com.confluence.sih.service.report.ReportService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@CrossOrigin(origins = "http://localhost:3039")
@RequestMapping("/api/reports")
public class ReportController {
    
    @Autowired
    private ReportService reportService;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatService chatService;

    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> generateReport(@RequestPart ReportRequest reportRequest,
                                                @RequestPart List<MultipartFile> images,
                                                @RequestPart List<MultipartFile> charts,
                                                @RequestParam UUID sessionId) {
        // byte[] pdfBytes = reportService.generateReport(reportRequest, images, charts).toByteArray();
        // return ResponseEntity.ok()
        //         .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
        //         .contentType(MediaType.APPLICATION_PDF)
        //         .body(pdfBytes);
        Report report = reportService.generateReport(reportRequest, images, charts);
        ChatMessage lastBotMessage = chatService.findLatestBotMessageBySessionId(sessionId);
        lastBotMessage.setReport(report);
        chatMessageRepository.save(lastBotMessage);
        return ResponseEntity.ok().body(report.getUrl());
    }
    
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }
    
}
