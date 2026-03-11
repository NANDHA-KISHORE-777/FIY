package com.confluence.sih.service.tts;

import java.io.File;
import java.io.FileInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import com.confluence.sih.common.constants.TextToSpeechConstants;
import com.confluence.sih.dto.tts.TtsRequest;

@Service
public class TtsServiceImpl implements TtsService {
    
    @Override
    public InputStreamResource generateSpeech(TtsRequest ttsRequest) throws Exception {
        String text = ttsRequest.getText();
        String lang = ttsRequest.getLang();
        String voice = TextToSpeechConstants.VOICE_MAP.getOrDefault(lang, "en-IN-NeerjaNeural");
        File outputFile = File.createTempFile("speech", ".mp3");
        ProcessBuilder processBuilder = new ProcessBuilder(
            "python3",
            "-m",
            "edge_tts",
            "--text", text,
            "--voice", voice,
            "--write-media", outputFile.getAbsolutePath()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        int exitCode = process.waitFor();
        if (exitCode == 0) {
            return new InputStreamResource(new FileInputStream(outputFile));
        } else {
            throw new Exception("Failed to generate speech, exit code: " + exitCode);
        }
    }
}
