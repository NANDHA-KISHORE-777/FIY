import { useEffect, useState } from 'react';
import { getCategorizationSummary } from 'src/api/analytics';
import { getAllAssessmentData } from 'src/api/groundWaterAssessment';
import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';
import { CategorizationSummary, GroundWaterAssessment } from 'src/types/GroundWaterAssessment';

export default function Page() {
  const [data, setData] = useState<GroundWaterAssessment[]>([]);
    const [categorizationSummary, setCategorizationSummary] = useState<CategorizationSummary>({} as CategorizationSummary);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchData() {
          try {
              const [allData, summaryData] = await Promise.all([
                getAllAssessmentData(),
                getCategorizationSummary(),
              ]);
              setData(allData);
              setCategorizationSummary(summaryData);
          } catch (err) {
              console.error("Error fetching dashboard data:", err);
          } finally {
              setLoading(false);
          }
      }
      fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    return (
      <>
        <title>{`Dashboard - ${CONFIG.appName}`}</title>
        <DashboardView assessmentData={data} categorizationSummary={categorizationSummary} />
      </>
    );
}
