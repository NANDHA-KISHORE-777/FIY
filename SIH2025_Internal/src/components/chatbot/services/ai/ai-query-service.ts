// AI Query Service for INGRES Groundwater ChatBot
// Uses Gemini 1.5 Flash API for intelligent query understanding

import { AI_CONFIG, isApiKeyConfigured, debugConfig } from '../config';

export interface QueryParameters {
  state?: string;
  district?: string;
  unit_name?: string;
  unit_type?: string;
  parameter?: string;
  condition?: string;
  action: string;
  filters?: Record<string, any>;
  sql?: string;
}

export interface AIQueryResponse {
  success: boolean;
  query: QueryParameters;
  confidence: number;
  explanation?: string;
  error?: string;
}

class AIQueryService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = AI_CONFIG.GEMINI_API_KEY;
    this.apiUrl = AI_CONFIG.GEMINI_API_URL;

    // Debug configuration on initialization
    debugConfig();
  }



  private getPrompt(userMessage: string): string {
    return `
You are a SQL query generator for the INGRES Groundwater Database. Convert natural language to SQL queries ONLY.

Database Schema:
Table: ground_water_assessment
Columns: id, annual_extractable_resource, annual_gw_allocation2025, unit_name, assessment_unit_type, categorization, district, extraction_domestic, extraction_industrial, extraction_irrigation, net_gw_availability, recharge_other_monsoon, recharge_other_non_monsoon, recharge_rainfall_monsoon, recharge_rainfall_non_monsoon, recharge_worthy_area, sl_no, stage_extraction_percent, state, total_annual_recharge, total_area, total_extraction, total_natural_discharge

Valid categorization values: 'SAFE', 'SEMI_CRITICAL', 'CRITICAL', 'OVER_EXPLOITED'
Valid states: 'West Bengal', 'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh' (exact case)
Valid districts: 'ALIPURDUAR', 'BANKURA', 'BIRBHUM', 'DAKSHIN DINAJPUR' (and others - use UPPERCASE)

Rules:
1. Return ONLY a valid SQL SELECT query
2. If query is not groundwater-related, return: "not a valid query"
3. Use exact column names from schema
4. Use proper SQL syntax with WHERE clauses

User Query: "${userMessage}"

Examples:
Query: "Show me water levels in Tamil Nadu"
Response: SELECT * FROM ground_water_assessment WHERE state = 'Tamil Nadu';

Query: "Find over-exploited areas"
Response: SELECT * FROM ground_water_assessment WHERE categorization = 'OVER_EXPLOITED';

Query: "Show irrigation data for West Bengal"
Response: SELECT extraction_irrigation FROM ground_water_assessment WHERE state = 'West Bengal';

Query: "What is the weather today?"
Response: not a valid query

Generate SQL query:`;
  }

  async generateQuery(userMessage: string): Promise<AIQueryResponse> {
    try {
      if (!isApiKeyConfigured()) {
        console.warn('⚠️ Gemini API key not configured, using fallback');
        return this.fallbackQueryGeneration(userMessage);
      }

      const prompt = this.getPrompt(userMessage);

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: AI_CONFIG.GEMINI_CONFIG
      };

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      if (generatedText === "not a valid query") {
        return {
          success: false,
          query: { action: 'invalid' },
          confidence: 0,
          error: "not a valid query"
        };
      }

      return {
        success: true,
        query: { action: 'sql', sql: generatedText },
        confidence: 1.0,
        explanation: "Generated SQL query"
      };

    } catch (error) {
      console.error('AI Query Service Error:', error);

      // Fallback to basic keyword matching
      return this.fallbackQueryGeneration(userMessage);
    }
  }

  // Fallback method using simple keyword matching
  private fallbackQueryGeneration(userMessage: string): AIQueryResponse {
    const message = userMessage.toLowerCase();
    const query: QueryParameters = {
      action: 'search'
    };

    // Basic location extraction
    if (message.includes('tamil nadu')) query.state = 'TAMIL NADU';
    if (message.includes('ariyalur')) query.district = 'ARIYALUR';

    // Basic parameter detection
    if (message.includes('water level') || message.includes('recharge')) {
      query.parameter = 'annual_recharge';
    } else if (message.includes('rainfall') || message.includes('monsoon')) {
      query.parameter = 'rainfall_monsoon';
    } else if (message.includes('extraction') || message.includes('usage')) {
      query.parameter = 'total_extraction';
    } else if (message.includes('status') || message.includes('category')) {
      query.parameter = 'categorization';
    }

    // Basic condition detection
    if (message.includes('over-exploited') || message.includes('overexploited')) {
      query.condition = 'over_exploited';
      query.filters = { categorization: 'over_exploited' };
    } else if (message.includes('critical')) {
      query.condition = 'critical';
      query.filters = { categorization: 'critical' };
    } else if (message.includes('safe')) {
      query.condition = 'safe';
      query.filters = { categorization: 'safe' };
    }

    return {
      success: true,
      query,
      confidence: 0.6,
      explanation: 'Generated using fallback keyword matching (AI service unavailable)'
    };
  }

  // Method to validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      if (!isApiKeyConfigured()) {
        return false;
      }

      const testResponse = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });

      return testResponse.ok;
    } catch {
      return false;
    }
  }
}

export const aiQueryService = new AIQueryService();
