package com.confluence.sih.service.report;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.confluence.sih.dto.report.ReportRequest;
import com.confluence.sih.model.Report;
import com.confluence.sih.repository.ReportRepository;
import com.confluence.sih.service.catbox.CatBoxClient;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

@Service
public class ReportServiceImpl implements ReportService{

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private CatBoxClient catBoxClient;

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Report generateReport(ReportRequest reportRequest, List<MultipartFile> images, List<MultipartFile> charts) {
        try {
            List<Map<String, Object>> rowsMap = reportRequest.getData();
            List<String> headers = new ArrayList<>(rowsMap.get(0).keySet());
            List<List<String>> tableRows = rowsMap.stream()
                    .map(row -> headers.stream()
                                        .map(header -> String.valueOf(row.get(header)))
                                        .collect(Collectors.toList()))
                    .collect(Collectors.toList());
            List<String> base64Images = images.stream().map(file -> {
                try {
                    String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                    String contentType = file.getContentType();
                    return "data:" + contentType + ";base64," + base64;
                } catch (Exception e) {
                    throw new RuntimeException("Error processing file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());

            List<String> base64Charts = charts.stream().map(file -> {
                try {
                    String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                    String contentType = file.getContentType();
                    return "data:" + contentType + ";base64," + base64;
                } catch (Exception e) {
                    throw new RuntimeException("Error processing file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());

            Context context = new Context();
            context.setVariable("title", reportRequest.getTitle());
            context.setVariable("description", reportRequest.getDescription());
            context.setVariable("headers", headers);
            context.setVariable("rows", tableRows);
            context.setVariable("images", base64Images);
            context.setVariable("charts", base64Charts);

            String htmlContent = templateEngine.process("report-template", context);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(out);
            builder.run();

            String pdfUrl = catBoxClient.uploadPdf(out, "report.pdf");
            return createReport(pdfUrl);
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public Report createReport(String url) {
        Report report = new Report();
        report.setUrl(url);
        return reportRepository.save(report);
    }

    public Report getReport(UUID reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
