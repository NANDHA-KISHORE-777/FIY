package com.confluence.sih.service.query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.confluence.sih.model.PopularQuery;

import java.util.List;

@Service
public class PopularQueryService {

    @Autowired
    private PopularQueryCache cache;

    public void recordQuery(String userPrompt, String query) {
        cache.recordPrompt(userPrompt, query);
    }

    public List<PopularQuery> getTopQueries(int n) {
        return cache.getTopQueries(n);
    }
}
