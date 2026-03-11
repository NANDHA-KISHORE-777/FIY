
export type Categorization =
  | "OVER_EXPLOITED"
  | "CRITICAL"
  | "SEMI_CRITICAL"
  | "SAFE"
  | "SALINE";

export interface GroundWaterAssessment {
  id?: number;
  state: string;
  district: string;
  assessmentUnitName: string;
  assessmentUnitType: string;
  totalArea: number;
  rechargeWorthyArea: number;
  rechargeRainfallMonsoon: number;
  rechargeOtherMonsoon: number;
  rechargeRainfallNonMonsoon: number;
  rechargeOtherNonMonsoon: number;
  totalAnnualRecharge: number;
  totalNaturalDischarge: number;
  annualExtractableResource: number;
  extractionIrrigation: number;
  extractionIndustrial: number;
  extractionDomestic: number;
  totalExtraction: number;
  annualGwAllocation2025: number;
  netGwAvailability: number;
  stageExtractionPercent: number;
  categorization: Categorization;
}

export type CategorizationSummary = Record<Categorization, number>;
