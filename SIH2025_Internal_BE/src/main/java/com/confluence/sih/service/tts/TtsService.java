package com.confluence.sih.service.tts;

import org.springframework.core.io.InputStreamResource;

import com.confluence.sih.dto.tts.TtsRequest;

public interface TtsService {
    InputStreamResource generateSpeech(TtsRequest ttsRequest) throws Exception;
}
