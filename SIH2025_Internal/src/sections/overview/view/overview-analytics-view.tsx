import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import {
  CategorizationSummary,
  GroundWaterAssessment,
} from 'src/types/GroundWaterAssessment';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { ComplaintTable } from 'src/sections/assessment';
import { mockComplaintData } from 'src/_mock/complaint-data';

// ----------------------------------------------------------------------

interface OverviewAnalyticsViewProps {
  assessmentData: GroundWaterAssessment[];
  categorizationSummary: CategorizationSummary;
}

export function OverviewAnalyticsView({
  assessmentData,
  categorizationSummary,
}: OverviewAnalyticsViewProps) {

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>


      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Complaints Submitted"
            total={3}
            icon={<Iconify icon="solar:pen-bold" width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Complaints Pending"
            total={1}
            color="secondary"
            icon={<Iconify icon="solar:eye-bold" width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Complaints Solved"
            total={2}
            color="warning"
            icon={<Iconify icon="solar:share-bold" width={32} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Complaints Rejected"
            total={0}
            color="error"
            icon={<Iconify icon="solar:chat-round-dots-bold" width={32} />}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ComplaintTable complaintData={mockComplaintData} />
        </Grid>

      </Grid>

    </DashboardContent>
  );
}
