package com.confluence.sih.dto.report;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AssessmentRecord {
    private String district;
    private String assessmentUnitName;
    private double totalAnnualRecharge;
    private double totalExtraction;
    private double stageExtractionPercent;
    private String categorization;
}