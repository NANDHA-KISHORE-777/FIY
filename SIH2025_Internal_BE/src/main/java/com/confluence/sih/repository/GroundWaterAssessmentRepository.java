package com.confluence.sih.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.confluence.sih.common.enums.Categorization;
import com.confluence.sih.model.GroundWaterAssessment;

public interface GroundWaterAssessmentRepository extends JpaRepository<GroundWaterAssessment, Long>{
    @Query("SELECT g.categorization, COUNT(g) FROM GroundWaterAssessment g GROUP BY g.categorization")
    List<Object[]> countCategorizationRaw();

    default Map<Categorization, Long> countByCategorization() {
        Map<Categorization, Long> map = new HashMap<>();
        for (Object[] row : countCategorizationRaw()) {
            map.put(Categorization.fromString(row[0].toString()), (Long) row[1]);
        }
        return map;
    }
}
