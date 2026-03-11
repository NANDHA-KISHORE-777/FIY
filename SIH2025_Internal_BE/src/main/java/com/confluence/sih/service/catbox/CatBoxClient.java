package com.confluence.sih.service.catbox;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;

import org.springframework.core.io.ByteArrayResource;

@Service
public class CatBoxClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String uploadUrl = "https://catbox.moe/user/api.php";

    public String uploadPdf(ByteArrayOutputStream pdfBytes, String filename) {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("reqtype", "fileupload");
            body.add("fileToUpload", new ByteArrayResource(pdfBytes.toByteArray()) {
                @Override
                public String getFilename() {
                    return filename;
                }
            });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Catbox upload failed: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error uploading PDF to Catbox", e);
        }
    }
}
