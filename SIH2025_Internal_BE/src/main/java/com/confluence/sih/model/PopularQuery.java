package com.confluence.sih.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@Table(name = "popular_queries")
@NoArgsConstructor
@AllArgsConstructor
public class PopularQuery {
    @Id
    private String userPrompt;
    private String query;
    private Long count;
}
