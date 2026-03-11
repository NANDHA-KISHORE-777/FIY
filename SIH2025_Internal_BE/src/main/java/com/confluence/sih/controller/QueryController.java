package com.confluence.sih.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.confluence.sih.dto.query.QueryRequest;
import com.confluence.sih.model.PopularQuery;
import com.confluence.sih.service.chat.ChatService;
import com.confluence.sih.service.query.PopularQueryService;
import com.confluence.sih.service.query.QueryService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:3039")
@RequestMapping("/api/query")
public class QueryController {

    @Autowired
    private QueryService queryService;

    @Autowired
    private PopularQueryService popularQueryService;

    @Autowired
    private ChatService chatService;
    
    @PostMapping("/execute")
    public ResponseEntity<List<Map<String, Object>>> executeQueryList(@RequestBody QueryRequest queryRequest, @RequestParam UUID sessionId) {
        String sqlQuery = queryRequest.getSqlQuery();
        String userPrompt = queryRequest.getUserPrompt();
        try {
            List<Map<String, Object>> result = queryService.runSelectQuery(sqlQuery);
            popularQueryService.recordQuery(userPrompt, sqlQuery);
            chatService.addBotMessage(sessionId, null, null, sqlQuery);
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            return null;
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<PopularQuery>> getPopularQueries() {
        List<PopularQuery> popularQueries = popularQueryService.getTopQueries(3);
        return ResponseEntity.ok(popularQueries);
    }
}
