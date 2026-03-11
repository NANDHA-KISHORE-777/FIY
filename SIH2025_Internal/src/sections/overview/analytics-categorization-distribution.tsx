
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';
import { CategorizationSummary } from 'src/types/GroundWaterAssessment';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCategorizationDistribution({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: chart.series.map((i) => i.label),
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            show: true,
            value: {
              formatter: (value) => fNumber(Number(value)),
            },
            total: {
              show: true,
              label: 'Total',
              formatter: (w: { globals: { seriesTotals: any[]; }; }) => {
                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other} data-chart-component="donut-chart">
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <Chart
        type="donut"
        series={chartSeries}
        options={chartOptions}
        sx={{ width: 400, height: 230, mx: 'auto' }}
      />
    </Card>
  );
}
