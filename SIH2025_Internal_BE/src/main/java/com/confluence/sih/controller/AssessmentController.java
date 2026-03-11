package com.confluence.sih.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.confluence.sih.common.enums.Categorization;
import com.confluence.sih.model.GroundWaterAssessment;
import com.confluence.sih.service.assessment.AssessmentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@CrossOrigin(origins = { "http://localhost:3039"})
@RequestMapping("/api/assessment")
public class AssessmentController {
    
    @Autowired
    private AssessmentService assessmentService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile csvFile) throws Exception {
        assessmentService.uploadCsv(csvFile);
        return ResponseEntity.ok("CSV file uploaded successfully.");
    }

    @GetMapping("/retrieve")
    public ResponseEntity<List<GroundWaterAssessment>> getAllAssessmentData() {
        List<GroundWaterAssessment> assessmentData = assessmentService.getAllAssessmentData();
        return ResponseEntity.ok(assessmentData);
    }

    @GetMapping("/categorization-summary")
    public ResponseEntity<Map<Categorization, Long>> getCategorizationSummary() {
        Map<Categorization, Long> summary = assessmentService.getCategorizationSummary();
        return ResponseEntity.ok(summary);
    }

}
