import { useState, useMemo } from 'react';
import { GroundWaterAssessment, CategorizationSummary } from 'src/types/GroundWaterAssessment';

export interface StateFilterHookProps {
  assessmentData: GroundWaterAssessment[];
  categorizationSummary: CategorizationSummary;
}

export interface FilteredAnalyticsData {
  filteredData: GroundWaterAssessment[];
  filteredCategorizationSummary: CategorizationSummary;
  availableStates: string[];
  selectedState: string;
  setSelectedState: (state: string) => void;
  stateWiseDistribution: Record<string, { Safe: number; 'Over-Exploited': number }>;
  stateWiseDistributionChart: {
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
  netGwAvailabilityChart: {
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
  categorizationSeries: { label: string; value: number }[];
  totalStats: {
    totalAnnualRecharge: number;
    totalAssessmentUnits: number;
    totalExtractableResources: number;
    totalExtraction: number;
  };
}

export function useStateFilter({ assessmentData, categorizationSummary }: StateFilterHookProps): FilteredAnalyticsData {
  // Get all available states
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(assessmentData.map(item => item.state))).sort();
    return ['All States', ...states];
  }, [assessmentData]);

  const [selectedState, setSelectedState] = useState<string>('All States');

  // Filter data based on selected state
  const filteredData = useMemo(() => {
    if (selectedState === 'All States') {
      return assessmentData;
    }
    return assessmentData.filter(item => item.state === selectedState);
  }, [assessmentData, selectedState]);

  // Calculate filtered categorization summary
  const filteredCategorizationSummary = useMemo(() => {
    if (selectedState === 'All States') {
      return categorizationSummary;
    }
    
    const summary: CategorizationSummary = {
      OVER_EXPLOITED: 0,
      CRITICAL: 0,
      SEMI_CRITICAL: 0,
      SAFE: 0,
      SALINE: 0,
    };

    filteredData.forEach(item => {
      // Add null/undefined check for categorization
      if (item.categorization) {
        const category = item.categorization.toUpperCase() as keyof CategorizationSummary;
        if (summary[category] !== undefined) {
          summary[category]++;
        }
      }
    });

    return summary;
  }, [filteredData, selectedState, categorizationSummary]);

  // Calculate categorization series for pie chart
  const categorizationSeries = useMemo(() => 
    Object.entries(filteredCategorizationSummary)
      .filter(([, value]) => value > 0)
      .map(([label, value]) => ({
        label: label.replace('_', '-').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        value,
      }))
  , [filteredCategorizationSummary]);

  // Calculate total statistics
  const totalStats = useMemo(() => ({
    totalAnnualRecharge: filteredData.reduce((sum, item) => sum + item.totalAnnualRecharge, 0),
    totalAssessmentUnits: filteredData.length,
    totalExtractableResources: filteredData.reduce((sum, item) => sum + item.annualExtractableResource, 0),
    totalExtraction: filteredData.reduce((sum, item) => sum + item.totalExtraction, 0),
  }), [filteredData]);

  // Calculate state-wise distribution for horizontal bar chart
  const stateWiseDistribution = useMemo(() => {
    if (selectedState !== 'All States') {
      // For single state, show district-wise distribution
      const districtDistribution = filteredData.reduce((acc, item) => {
        if (!acc[item.district]) {
          acc[item.district] = {
            Safe: 0,
            'Over-Exploited': 0,
          };
        }
        
        // Add null/undefined check for categorization
        if (item.categorization) {
          const categoryUpper = item.categorization.toUpperCase();
          if (categoryUpper === 'SAFE') {
            acc[item.district].Safe += 1;
          } else if (categoryUpper === 'OVER_EXPLOITED' || categoryUpper === 'OVER-EXPLOITED') {
            acc[item.district]['Over-Exploited'] += 1;
          }
        }
        
        return acc;
      }, {} as Record<string, { Safe: number; 'Over-Exploited': number }>);
      
      return districtDistribution;
    }

    // For all states, show state-wise distribution
    return assessmentData.reduce((acc, item) => {
      if (!acc[item.state]) {
        acc[item.state] = {
          Safe: 0,
          'Over-Exploited': 0,
        };
      }
      
      // Add null/undefined check for categorization
      if (item.categorization) {
        const categoryUpper = item.categorization.toUpperCase();
        if (categoryUpper === 'SAFE') {
          acc[item.state].Safe += 1;
        } else if (categoryUpper === 'OVER_EXPLOITED' || categoryUpper === 'OVER-EXPLOITED') {
          acc[item.state]['Over-Exploited'] += 1;
        }
      }
      
      return acc;
    }, {} as Record<string, { Safe: number; 'Over-Exploited': number }>);
  }, [filteredData, selectedState, assessmentData]);

  // Create chart data for state/district-wise distribution
  const stateWiseDistributionChart = useMemo(() => {
    const sortedKeys = Object.keys(stateWiseDistribution)
      .sort((a, b) => {
        const totalA = stateWiseDistribution[a].Safe + stateWiseDistribution[a]['Over-Exploited'];
        const totalB = stateWiseDistribution[b].Safe + stateWiseDistribution[b]['Over-Exploited'];
        return totalB - totalA; // Sort by total count descending
      })
      .slice(0, 10); // Show top 10

    return {
      categories: sortedKeys,
      series: [
        {
          name: 'Over-Exploited',
          data: sortedKeys.map((key) => stateWiseDistribution[key]['Over-Exploited']),
        },
        {
          name: 'Safe',
          data: sortedKeys.map((key) => stateWiseDistribution[key].Safe),
        },
      ],
    };
  }, [stateWiseDistribution]);

  // Calculate net GW availability chart
  const netGwAvailabilityChart = useMemo(() => {
    const topDistricts = filteredData
      .sort((a, b) => b.netGwAvailability - a.netGwAvailability)
      .slice(0, 10); // Show top 10

    return {
      categories: topDistricts.map((item) =>
        // Show district name and state for better context
        selectedState === 'All States' ? `${item.district}, ${item.state}` : item.district
      ),
      series: [
        {
          name: 'Net GW Availability',
          data: topDistricts.map((item) => item.netGwAvailability),
        },
      ],
    };
  }, [filteredData, selectedState]);

  return {
    filteredData,
    filteredCategorizationSummary,
    availableStates,
    selectedState,
    setSelectedState,
    stateWiseDistribution,
    stateWiseDistributionChart,
    netGwAvailabilityChart,
    categorizationSeries,
    totalStats,
  };
}