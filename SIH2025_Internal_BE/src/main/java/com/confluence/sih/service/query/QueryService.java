package com.confluence.sih.service.query;

import java.util.List;
import java.util.Map;

public interface QueryService {
    List<Map<String, Object>> runSelectQuery(String sqlQuery);
}
