import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props {
  assessmentData: GroundWaterAssessment[];
}

export function AnalyticsUsageReport({ assessmentData }: Props) {
  const theme = useTheme();

  const totalIrrigation = assessmentData.reduce(
    (sum, item) => sum + item.extractionIrrigation,
    0
  );
  const totalIndustrial = assessmentData.reduce(
    (sum, item) => sum + item.extractionIndustrial,
    0
  );
  const totalDomestic = assessmentData.reduce(
    (sum, item) => sum + item.extractionDomestic,
    0
  );

  const chartData = {
    categories: ['Irrigation', 'Industrial', 'Domestic'],
    series: [
      {
        name: 'Extraction',
        data: [totalIrrigation, totalIndustrial, totalDomestic],
      },
    ],
  };

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
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
      <CardHeader title="Extraction Breakdown" />
      <Chart
        type="bar"
        series={chartData.series}
        options={chartOptions}
        sx={{ py: 2.5, pl: 1, pr: 2.5, height: 320 }}
      />
    </Card>
  );
}