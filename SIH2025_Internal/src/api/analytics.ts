import { BE_BASE_URL } from "src/constants/common";
import { Categorization, CategorizationSummary } from "src/types/GroundWaterAssessment";

export async function getCategorizationSummary(): Promise<CategorizationSummary> {
    const response = await fetch(`${BE_BASE_URL}/api/assessment/categorization-summary`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error fetching categorization summary: ${response.statusText}`);
    }

    const data: CategorizationSummary = await response.json();
    return data;
}


export async function getCategorizationSummaryByState(state?: string): Promise<CategorizationSummary> {
    let url = `${BE_BASE_URL}/api/assessment/categorization-summary`;
    
    if (state && state !== 'All States') {
        url += `?state=${encodeURIComponent(state)}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error fetching categorization summary: ${response.statusText}`);
    }

    const data: CategorizationSummary = await response.json();
    return data;
}
