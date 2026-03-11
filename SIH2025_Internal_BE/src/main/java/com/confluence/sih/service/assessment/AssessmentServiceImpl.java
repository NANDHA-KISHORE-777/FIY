package com.confluence.sih.service.assessment;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.confluence.sih.common.enums.Categorization;
import com.confluence.sih.model.GroundWaterAssessment;
import com.confluence.sih.repository.GroundWaterAssessmentRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

@Service
public class AssessmentServiceImpl implements AssessmentService{

    @Autowired
    private GroundWaterAssessmentRepository assessmentRepository;

    private final Integer BATCH_SIZE = 100;

    @Override
    public void uploadCsv(MultipartFile csvFile) throws Exception {
        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(csvFile.getInputStream(), StandardCharsets.UTF_8))) {
                CsvToBean<GroundWaterAssessment> csvToBean = new CsvToBeanBuilder<GroundWaterAssessment>(reader)
                    .withType(GroundWaterAssessment.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .withThrowExceptions(false)
                    .build();

                List<GroundWaterAssessment> records = csvToBean.parse();
                System.out.println("Records parsed: " + records.size());
                records.stream().limit(5).forEach(System.out::println);
                int recordSize = records.size();
                for (int start = 0; start < recordSize; start += BATCH_SIZE) {
                    int end = Math.min(start + BATCH_SIZE, recordSize);
                    assessmentRepository.saveAll(records.subList(start, end));
                }
            } catch (Exception e) {
                throw new Exception("Error processing CSV file: " + e.getMessage());
            }
    }

    @Override
    public List<GroundWaterAssessment> getAllAssessmentData() {
        return assessmentRepository.findAll();
    }

    @Override
    public Map<Categorization, Long> getCategorizationSummary() {
        return assessmentRepository.countByCategorization();
    }
    
}
