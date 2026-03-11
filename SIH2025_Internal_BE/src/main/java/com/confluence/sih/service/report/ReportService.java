package com.confluence.sih.service.report;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.confluence.sih.dto.report.ReportRequest;
import com.confluence.sih.model.Report;

public interface ReportService {
    Report generateReport(ReportRequest reportRequest, List<MultipartFile> images, List<MultipartFile> charts);
    Report createReport(String url);
    Report getReport(UUID reportId);
    List<Report> getAllReports();
}
