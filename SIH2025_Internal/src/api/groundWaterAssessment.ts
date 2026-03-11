import { BE_BASE_URL } from "src/constants/common";
import { GroundWaterAssessment, CategorizationSummary } from "../types/GroundWaterAssessment";


export async function getAllAssessmentData(): Promise<GroundWaterAssessment[]> {
  const response = await fetch(`${BE_BASE_URL}/api/assessment/retrieve`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching assessment data: ${response.statusText}`);
  }

  const data: GroundWaterAssessment[] = await response.json();
  return data;
}


export async function getAssessmentDataByState(state?: string): Promise<GroundWaterAssessment[]> {
  let url = `${BE_BASE_URL}/api/assessment/retrieve`;
  
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
    throw new Error(`Error fetching assessment data: ${response.statusText}`);
  }

  const data: GroundWaterAssessment[] = await response.json();
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
