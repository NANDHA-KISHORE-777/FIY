package com.confluence.sih.service.assessment;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.confluence.sih.common.enums.Categorization;
import com.confluence.sih.model.GroundWaterAssessment;

public interface AssessmentService {
    void uploadCsv(MultipartFile csvFile) throws Exception;
    List<GroundWaterAssessment> getAllAssessmentData();
    Map<Categorization, Long> getCategorizationSummary();
}
