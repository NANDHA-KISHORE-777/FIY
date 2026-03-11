
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    series: {
      name: string;
      data: {
        x: string;
        y: number;
        goals: {
          name: string;
          value: number;
          strokeColor: string;
        }[];
      }[];
    }[];
  };
};

export function AnalyticsExtractionBreakdown({ title, subheader, chart, ...other }: Props) {
  const chartOptions = useChart({
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '25%',
      },
    },
    xaxis: {
      type: 'category',
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        sx={{ height: 350, mt: 3, mx: 3 }}
      />
    </Card>
  );
}
