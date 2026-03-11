package com.confluence.sih.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.confluence.sih.model.PopularQuery;

public interface PopularQueryRepository extends JpaRepository<PopularQuery, String>{
    
}
