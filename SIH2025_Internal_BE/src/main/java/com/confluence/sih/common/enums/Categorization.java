package com.confluence.sih.common.enums;

import java.util.Arrays;

public enum Categorization {
    OVER_EXPLOITED("over-exploited"),
    CRITICAL("critical"),
    SEMI_CRITICAL("semi-critical"),
    SAFE("safe"),
    SALINE("saline");

    private final String label;

    Categorization(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Categorization fromString(String value) {
        if (value == null) return null;
        return Arrays.stream(values())
                .filter(c -> c.label.equalsIgnoreCase(value.trim())
                          || c.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown categorization: " + value));
    }
}
