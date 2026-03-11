package com.confluence.sih.model;

import com.confluence.sih.common.enums.Categorization;
import com.opencsv.bean.CsvBindByName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@Table(name = "ground_water_assessment")
@NoArgsConstructor
@AllArgsConstructor
public class GroundWaterAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CsvBindByName(column = "state")
    private String state;

    @CsvBindByName(column = "district")
    private String district;

    @CsvBindByName(column = "unit_name")
    @Column(name = "unit_name", nullable = false)
    private String assessmentUnitName;

    @CsvBindByName(column = "unit_type")
    private String assessmentUnitType;

    @CsvBindByName(column = "total_area")
    private Double totalArea;

    @CsvBindByName(column = "worthy_area")
    private Double rechargeWorthyArea;

    @CsvBindByName(column = "rainfall_monsoon")
    private Double rechargeRainfallMonsoon;

    @CsvBindByName(column = "other_monsoon")
    private Double rechargeOtherMonsoon;

    @CsvBindByName(column = "rainfall_non_monsoon")
    private Double rechargeRainfallNonMonsoon;

    @CsvBindByName(column = "other_non_monsoon")
    private Double rechargeOtherNonMonsoon;

    @CsvBindByName(column = "annual_recharge")
    private Double totalAnnualRecharge;

    @CsvBindByName(column = "natural_discharge")
    private Double totalNaturalDischarge;

    @CsvBindByName(column = "annual_extractable")
    private Double annualExtractableResource;

    @CsvBindByName(column = "irrigation")
    private Double extractionIrrigation;

    @CsvBindByName(column = "industrial")
    private Double extractionIndustrial;

    @CsvBindByName(column = "domestic")
    private Double extractionDomestic;

    @CsvBindByName(column = "total_extraction")
    private Double totalExtraction;

    @CsvBindByName(column = "allocation_2025")
    private Double annualGwAllocation2025;

    @CsvBindByName(column = "net_availability")
    private Double netGwAvailability;

    @CsvBindByName(column = "stage_percent")
    private Double stageExtractionPercent;

    @Enumerated(EnumType.STRING)
    @CsvBindByName(column = "categorization")
    @Column(length = 20)
    private Categorization categorization;
}
