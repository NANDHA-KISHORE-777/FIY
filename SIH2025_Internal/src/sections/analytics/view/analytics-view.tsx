import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';
import { Chart, useChart } from 'src/components/chart';
import {
  complaintTrendsData,
  ipcDistributionData,
  statusBreakdownData,
  responseTimeData,
  topIPCSections,
  dailyActivityData
} from 'src/_mock/analytics-data';

// ----------------------------------------------------------------------

export function AnalyticsView() {
  // Complaint Trends Chart
  const trendChartOptions = useChart({
    xaxis: {
      categories: complaintTrendsData.categories,
    },
    stroke: {
      curve: 'smooth',
    },
    colors: ['#667eea', '#10b981'],
  });

  // IPC Distribution Bar Chart (Improved for clarity)
  const ipcBarOptions = useChart({
    xaxis: {
      categories: ipcDistributionData.map(item => item.label.split(' ')[0] + ' ' + item.label.split(' ')[1]),
    },
    colors: ['#667eea'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    legend: {
      show: false,
    },
  });

  // Status Breakdown Bar Chart
  const statusBarOptions = useChart({
    xaxis: {
      categories: statusBreakdownData.map(item => item.status),
    },
    colors: statusBreakdownData.map(item => item.color),
    plotOptions: {
      bar: {
        borderRadius: 8,
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
  });

  // Response Time Chart
  const responseTimeOptions = useChart({
    xaxis: {
      categories: responseTimeData.categories,
    },
    colors: ['#667eea'],
    plotOptions: {
      bar: {
        borderRadius: 8,
      },
    },
  });

  // Daily Activity Chart
  const dailyActivityOptions = useChart({
    xaxis: {
      categories: dailyActivityData.categories,
    },
    colors: ['#10b981'],
    stroke: {
      curve: 'smooth',
    },
  });

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Analytics Dashboard 📊
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Total Complaints</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>180</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>↑ 12% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Resolved Cases</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>120</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>↑ 8% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Pending Cases</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>45</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>↓ 5% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Resolution Rate</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>66.7%</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Target: 75%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Complaint Trends */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Complaint Trends (2024)
              </Typography>
              <Box sx={{ height: 350 }}>
                <Chart
                  type="line"
                  series={complaintTrendsData.series}
                  options={trendChartOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* IPC Distribution - Improved Bar Chart */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Top IPC Sections
              </Typography>
              <Box sx={{ height: 350 }}>
                <Chart
                  type="bar"
                  series={[{ name: 'Cases', data: ipcDistributionData.map(item => item.value) }]}
                  options={ipcBarOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Status Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <Chart
                  type="bar"
                  series={[{ data: statusBreakdownData.map(item => item.count) }]}
                  options={statusBarOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Response Time Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Response Time Distribution
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Average</Typography>
                  <Typography variant="h6">{responseTimeData.avgResponseTime}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Fastest</Typography>
                  <Typography variant="h6" color="success.main">{responseTimeData.fastestResponse}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Slowest</Typography>
                  <Typography variant="h6" color="error.main">{responseTimeData.slowestResponse}</Typography>
                </Box>
              </Box>
              <Box sx={{ height: 220 }}>
                <Chart
                  type="bar"
                  series={[{ name: 'Cases', data: responseTimeData.data }]}
                  options={responseTimeOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top IPC Sections */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Top IPC Sections
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topIPCSections.map((item, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.section} - {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} cases
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: '#f0f0f0', 
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${item.percentage}%`, 
                        height: '100%', 
                        bgcolor: '#667eea',
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Weekly Activity
              </Typography>
              <Box sx={{ height: 300 }}>
                <Chart
                  type="area"
                  series={dailyActivityData.series}
                  options={dailyActivityOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
