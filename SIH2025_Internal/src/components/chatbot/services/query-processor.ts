// Query Processor for INGRES Groundwater Data
// Handles AI-generated queries and processes structured query parameters

import type { QueryParameters, AIQueryResponse } from "./ai/ai-query-service";

export interface ProcessedResult {
  success: boolean;
  data?: any[];
  message: string;
  query: QueryParameters;
  count?: number;
  summary?: string;
}

class QueryProcessor {
  // Mock dataset - In real implementation, this would connect to your actual database
  private mockDataset = [
    {
      sl_no: 1,
      state: "TAMIL NADU",
      district: "ARIYALUR",
      unit_name: "ANDIMADAM", 
      unit_type: "FIRKA",
      total_area: 13526.485,
      worthy_area: 13522.355,
      rainfall_monsoon: 1386.55,
      other_monsoon: 430.03,
      rainfall_non_monsoon: 0,
      other_non_monsoon: 179.93,
      annual_recharge: 1996.51,
      natural_discharge: 199.65,
      annual_extractable: 1796.86,
      irrigation: 731.6,
      industrial: 0,
      domestic: 41.56,
      total_extraction: 773.16,
      allocation_2025: 87.39,
      net_availability: 977.87,
      stage_percent: "43.02839398",
      categorization: "safe"
    },
    {
      sl_no: 2,
      state: "TAMIL NADU",
      district: "ARIYALUR",
      unit_name: "ARIYALUR",
      unit_type: "FIRKA", 
      total_area: 19017.845,
      worthy_area: 19017.845,
      rainfall_monsoon: 1849.9,
      other_monsoon: 557.9,
      rainfall_non_monsoon: 110.68,
      other_non_monsoon: 140.93,
      annual_recharge: 2659.41,
      natural_discharge: 265.94,
      annual_extractable: 2393.47,
      irrigation: 1143.8,
      industrial: 16.3,
      domestic: 90.54175475,
      total_extraction: 1250.64,
      allocation_2025: 94.5,
      net_availability: 1138.87,
      stage_percent: "52.25216944",
      categorization: "safe"
    },
    {
      sl_no: 3,
      state: "TAMIL NADU", 
      district: "ARIYALUR",
      unit_name: "ELAKURICHI",
      unit_type: "FIRKA",
      total_area: 10008.27,
      worthy_area: 9895.9,
      rainfall_monsoon: 965.87,
      other_monsoon: 2651.06,
      rainfall_non_monsoon: 40.02,
      other_non_monsoon: 117.6,
      annual_recharge: 3774.55,
      natural_discharge: 377.46,
      annual_extractable: 3397.09,
      irrigation: 1152,
      industrial: 0,
      domestic: 75.52392035,
      total_extraction: 1227.52,
      allocation_2025: 75.52,
      net_availability: 2169.57,
      stage_percent: "36.13445626",
      categorization: "safe"
    }
  ];

  async processQuery(queryResponse: AIQueryResponse): Promise<ProcessedResult> {
    try {
      if (!queryResponse.success) {
        return {
          success: false,
          message: queryResponse.error || "Failed to process query",
          query: queryResponse.query
        };
      }

      const { query } = queryResponse;
      let filteredData = [...this.mockDataset];

      // Apply filters based on query parameters
      if (query.state) {
        filteredData = filteredData.filter(item => 
          item.state.toLowerCase() === query.state!.toLowerCase()
        );
      }

      if (query.district) {
        filteredData = filteredData.filter(item => 
          item.district.toLowerCase() === query.district!.toLowerCase()
        );
      }

      if (query.unit_name) {
        filteredData = filteredData.filter(item => 
          item.unit_name.toLowerCase() === query.unit_name!.toLowerCase()
        );
      }

      if (query.unit_type) {
        filteredData = filteredData.filter(item => 
          item.unit_type.toLowerCase() === query.unit_type!.toLowerCase()
        );
      }

      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          filteredData = filteredData.filter(item => {
            const itemValue = (item as any)[key];
            if (typeof itemValue === "string") {
              return itemValue.toLowerCase() === value.toLowerCase();
            }
            return itemValue === value;
          });
        });
      }

      // Generate response based on action type
      let message = "";
      let summary = "";

      switch (query.action) {
        case "search":
          message = this.generateSearchMessage(query, filteredData);
          summary = this.generateSummary(query, filteredData);
          break;
        case "filter":
          message = this.generateFilterMessage(query, filteredData);
          summary = this.generateSummary(query, filteredData);
          break;
        case "compare":
          message = this.generateCompareMessage(query, filteredData);
          summary = this.generateCompareSummary(query, filteredData);
          break;
        case "aggregate":
          message = this.generateAggregateMessage(query, filteredData);
          summary = this.generateAggregateSummary(query, filteredData);
          break;
        case "report":
          message = this.generateReportMessage(query, filteredData);
          summary = this.generateReportSummary(query, filteredData);
          break;
        default:
          message = this.generateSearchMessage(query, filteredData);
          summary = this.generateSummary(query, filteredData);
      }

      return {
        success: true,
        data: filteredData,
        message,
        query,
        count: filteredData.length,
        summary
      };

    } catch (error) {
      console.error("Query processing error:", error);
      return {
        success: false,
        message: "An error occurred while processing your query. Please try again.",
        query: queryResponse.query
      };
    }
  }

  private generateSearchMessage(query: QueryParameters, data: any[]): string {
    if (data.length === 0) {
      return "No data found matching your criteria.";
    }

    let message = `Found ${data.length} record(s)`;
    
    if (query.state) message += ` in ${query.state}`;
    if (query.district) message += ` ${query.district} district`;
    if (query.unit_name) message += ` for ${query.unit_name}`;
    
    if (query.parameter) {
      const parameterName = this.getParameterDisplayName(query.parameter);
      message += ` showing ${parameterName} data`;
    }

    return message + ".";
  }

  private generateFilterMessage(query: QueryParameters, data: any[]): string {
    if (data.length === 0) {
      return `No areas found with ${query.condition} status.`;
    }

    return `Found ${data.length} area(s) with ${query.condition} groundwater status.`;
  }

  private generateCompareMessage(query: QueryParameters, data: any[]): string {
    if (data.length === 0) {
      return "No data available for comparison.";
    }

    const parameterName = this.getParameterDisplayName(query.parameter || "");
    return `Comparison data for ${parameterName} across ${data.length} area(s).`;
  }

  private generateAggregateMessage(query: QueryParameters, data: any[]): string {
    if (data.length === 0) {
      return "No data available for aggregation.";
    }

    return `Aggregated statistics from ${data.length} area(s).`;
  }

  private generateReportMessage(query: QueryParameters, data: any[]): string {
    if (data.length === 0) {
      return "No data available for report generation.";
    }

    return `Generated comprehensive report covering ${data.length} area(s).`;
  }

  private generateSummary(query: QueryParameters, data: any[]): string {
    if (data.length === 0) return "";

    if (query.parameter) {
      const values = data.map(item => (item as any)[query.parameter!]).filter(v => v != null);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + Number(b), 0) / values.length;
        const max = Math.max(...values.map(Number));
        const min = Math.min(...values.map(Number));
        
        const parameterName = this.getParameterDisplayName(query.parameter);
        return `${parameterName}: Average: ${avg.toFixed(2)}, Max: ${max}, Min: ${min}`;
      }
    }

    // Categorization summary
    const categories = data.reduce((acc, item) => {
      const cat = item.categorization;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryText = Object.entries(categories)
      .map(([cat, count]) => `${count} ${cat}`)
      .join(", ");

    return `Status distribution: ${categoryText}`;
  }

  private generateCompareSummary(query: QueryParameters, data: any[]): string {
    // Implementation for comparison summary
    return this.generateSummary(query, data);
  }

  private generateAggregateSummary(query: QueryParameters, data: any[]): string {
    // Implementation for aggregate summary
    return this.generateSummary(query, data);
  }

  private generateReportSummary(query: QueryParameters, data: any[]): string {
    // Implementation for report summary
    return this.generateSummary(query, data);
  }

  private getParameterDisplayName(parameter: string): string {
    const displayNames: Record<string, string> = {
      annual_recharge: "Annual Recharge",
      rainfall_monsoon: "Monsoon Rainfall", 
      rainfall_non_monsoon: "Non-Monsoon Rainfall",
      total_extraction: "Total Extraction",
      irrigation: "Irrigation Usage",
      industrial: "Industrial Usage",
      domestic: "Domestic Usage",
      categorization: "Groundwater Status",
      stage_percent: "Extraction Stage",
      net_availability: "Net Availability",
      annual_extractable: "Annual Extractable"
    };

    return displayNames[parameter] || parameter;
  }
}

export const queryProcessor = new QueryProcessor();
