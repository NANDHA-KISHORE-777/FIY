package com.confluence.sih.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.confluence.sih.dto.tts.TtsRequest;
import com.confluence.sih.service.tts.TtsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/tts")
@CrossOrigin(origins = "http://localhost:3039")
public class TextToSpeechController {

    @Autowired
    private TtsService ttsService;
    
    @PostMapping("/generate")
    public ResponseEntity<InputStreamResource> generateSpeech(@RequestBody TtsRequest ttsRequest) throws Exception {
        InputStreamResource resource = ttsService.generateSpeech(ttsRequest);
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=speech.mp3")
            .body(resource);
    }
    
}
