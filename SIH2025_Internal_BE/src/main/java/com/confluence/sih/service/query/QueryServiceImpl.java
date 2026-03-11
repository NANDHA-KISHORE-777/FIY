package com.confluence.sih.service.query;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueryServiceImpl implements QueryService{
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> runSelectQuery(String sqlQuery) {
        String trimmed = sqlQuery.trim().toLowerCase();
        if (!trimmed.startsWith("select") || trimmed.contains("update") || trimmed.contains("insert") || trimmed.contains("delete") || trimmed.contains("drop") || trimmed.contains("create") || trimmed.contains("alter"))
            return null;
        return jdbcTemplate.queryForList(sqlQuery);
    }
}
