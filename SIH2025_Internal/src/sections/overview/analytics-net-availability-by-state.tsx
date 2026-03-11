
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsNetAvailabilityByState({ title, subheader, chart, ...other }: Props) {
  const chartOptions = useChart({
    stroke: { show: false },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
    xaxis: { categories: chart.categories },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '25%',
        borderRadius: 2,
      },
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
