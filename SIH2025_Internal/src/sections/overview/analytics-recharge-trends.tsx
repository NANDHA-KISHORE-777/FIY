import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props {
  assessmentData: GroundWaterAssessment[];
}

export function AnalyticsRechargeTrends({ assessmentData }: Props) {
  const theme = useTheme();

  const topDistricts = assessmentData
    .sort((a, b) => b.rechargeRainfallMonsoon - a.rechargeRainfallMonsoon)
    .slice(0, 5);

  const chartData = {
    categories: topDistricts.map((d) => d.district),
    series: [
      {
        name: 'Rainfall Monsoon Recharge',
        data: topDistricts.map((d) => d.rechargeRainfallMonsoon),
      },
      {
        name: 'Other Monsoon Recharge',
        data: topDistricts.map((d) => d.rechargeOtherMonsoon),
      },
    ],
  };

  const chartOptions = useChart({
    colors: [theme.palette.warning.main, theme.palette.info.main],
    xaxis: { categories: chartData.categories },
    stroke: { width: 2, curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          [
            { offset: 0, color: theme.palette.warning.main, opacity: 0.3 },
            { offset: 100, color: theme.palette.warning.main, opacity: 0 },
          ],
          [
            { offset: 0, color: theme.palette.info.main, opacity: 0.3 },
            { offset: 100, color: theme.palette.info.main, opacity: 0 },
          ],
        ],
      },
    },
  });

  return (
    <Card data-chart-component="area-chart">
      <CardHeader title="Recharge Trends (Top 5 Districts)" />
      <Chart
        type="area"
        series={chartData.series}
        options={chartOptions}
        sx={{ py: 2.5, pl: 1, pr: 2.5, height: 320 }}
      />
    </Card>
  );
}
