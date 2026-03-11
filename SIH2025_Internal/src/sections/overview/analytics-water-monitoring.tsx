import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props {
  assessmentData: GroundWaterAssessment[];
}

export function AnalyticsWaterMonitoring({ assessmentData }: Props) {
  const theme = useTheme();

  const topDistricts = assessmentData
    .sort((a, b) => b.totalAnnualRecharge - a.totalAnnualRecharge)
    .slice(0, 5);

  const chartData = {
    categories: topDistricts.map((d) => d.district),
    series: [
      {
        name: 'Total Annual Recharge',
        data: topDistricts.map((d) => d.totalAnnualRecharge),
      },
      {
        name: 'Total Extraction',
        data: topDistricts.map((d) => d.totalExtraction),
      },
    ],
  };

  const chartOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.error.main],
    xaxis: { categories: chartData.categories },
    stroke: { width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          [
            { offset: 0, color: theme.palette.primary.main, opacity: 0.8 },
            { offset: 100, color: theme.palette.primary.main, opacity: 0 },
          ],
          [
            { offset: 0, color: theme.palette.error.main, opacity: 0.8 },
            { offset: 100, color: theme.palette.error.main, opacity: 0 },
          ],
        ],
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Water Resource Monitoring (Top 5 Districts)" />
      <Chart
        type="area"
        series={chartData.series}
        options={chartOptions}
        sx={{ py: 2.5, pl: 1, pr: 2.5, height: 364 }}
      />
    </Card>
  );
}