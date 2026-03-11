package com.confluence.sih.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.confluence.sih.model.Report;

public interface ReportRepository extends JpaRepository<Report, UUID>{
    
}
