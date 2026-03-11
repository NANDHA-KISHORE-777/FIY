import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props {
  assessmentData: GroundWaterAssessment[];
}

export function AnalyticsDailyUsage({ assessmentData }: Props) {
  const theme = useTheme();

  const topDistricts = assessmentData
    .sort((a, b) => b.stageExtractionPercent - a.stageExtractionPercent)
    .slice(0, 5);

  const chartData = {
    categories: topDistricts.map((d) => d.district),
    series: [
      {
        name: 'Stage of Extraction (%)',
        data: topDistricts.map((d) => d.stageExtractionPercent),
      },
    ],
  };

  const chartOptions = useChart({
    colors: [theme.palette.info.light],
    xaxis: { categories: chartData.categories },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '48%',
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Stage of Extraction (Top 5 Districts)" />
      <Chart
        type="bar"
        series={chartData.series}
        options={chartOptions}
        sx={{ py: 2.5, pl: 1, pr: 2.5, height: 320 }}
      />
    </Card>
  );
}
