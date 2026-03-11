import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';

import { DashboardContent } from 'src/layouts/dashboard';
import { enhancedComplaintData } from 'src/_mock/enhanced-complaint-data';

// ----------------------------------------------------------------------

export function ReportsView() {
  const [reportType, setReportType] = useState('complaints');
  const [dateRange, setDateRange] = useState('all-2024');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Generate CSV content
  const generateCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return `${headers}\n${rows.join('\n')}`;
  };

  // Download file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    if (exportFormat === 'csv' || exportFormat === 'excel') {
      // Generate CSV for complaints
      const csvData = enhancedComplaintData.map(complaint => ({
        ID: complaint.id,
        Date: complaint.submittedDate,
        Complainant: complaint.complainantName,
        Description: complaint.complaintDescription.replace(/,/g, ';'),
        Location: complaint.location,
        IPC_Section: complaint.ipcSection || 'N/A',
        Status: complaint.status,
        Priority: complaint.priority,
        Officer: complaint.assignedTo || 'Unassigned',
      }));
      
      const csv = generateCSV(csvData);
      const filename = `${reportType}_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(csv, filename, 'text/csv');
    } else {
      // For PDF, create a simple text report
      let reportContent = `YURUS IPC MAPPER - ${reportType.toUpperCase()} REPORT\n`;
      reportContent += `Date Range: ${dateRange}\n`;
      reportContent += `Generated: ${new Date().toLocaleString()}\n`;
      reportContent += `\n${'='.repeat(80)}\n\n`;
      
      enhancedComplaintData.forEach((complaint, index) => {
        reportContent += `${index + 1}. Complaint ID: ${complaint.id}\n`;
        reportContent += `   Date: ${complaint.submittedDate}\n`;
        reportContent += `   Complainant: ${complaint.complainantName}\n`;
        reportContent += `   Description: ${complaint.complaintDescription}\n`;
        reportContent += `   Location: ${complaint.location}\n`;
        reportContent += `   IPC Section: ${complaint.ipcSection || 'N/A'}\n`;
        reportContent += `   Status: ${complaint.status}\n`;
        reportContent += `   Priority: ${complaint.priority}\n`;
        reportContent += `   Assigned Officer: ${complaint.assignedTo || 'Unassigned'}\n`;
        reportContent += `\n${'-'.repeat(80)}\n\n`;
      });
      
      const filename = `${reportType}_report_${dateRange}_${new Date().toISOString().split('T')[0]}.txt`;
      downloadFile(reportContent, filename, 'text/plain');
    }
  };

  const handleQuickDownload = (type: string, format: string) => {
    const csvData = enhancedComplaintData.map(complaint => ({
      ID: complaint.id,
      Date: complaint.submittedDate,
      Complainant: complaint.complainantName,
      Description: complaint.complaintDescription.replace(/,/g, ';'),
      Location: complaint.location,
      IPC_Section: complaint.ipcSection || 'N/A',
      Status: complaint.status,
      Priority: complaint.priority,
      Officer: complaint.assignedTo || 'Unassigned',
    }));
    
    if (format === 'Excel') {
      const csv = generateCSV(csvData);
      downloadFile(csv, `${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } else {
      let reportContent = `YURUS IPC MAPPER - ${type.toUpperCase()}\n`;
      reportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      reportContent += `${'='.repeat(80)}\n\n`;
      
      enhancedComplaintData.forEach((complaint, index) => {
        reportContent += `${index + 1}. ${complaint.complaintDescription}\n`;
        reportContent += `   Date: ${complaint.submittedDate} | Status: ${complaint.status}\n`;
        reportContent += `   IPC: ${complaint.ipcSection || 'N/A'} | Priority: ${complaint.priority}\n\n`;
      });
      
      downloadFile(reportContent, `${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
    }
  };

  const quickReports = [
    {
      title: 'All Complaints 2024',
      description: 'Complete list of all complaints filed in 2024',
      icon: <DescriptionIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      action: 'Download PDF',
      format: 'PDF',
    },
    {
      title: 'IPC Section Analysis',
      description: 'Most used IPC sections and trends',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      action: 'Download Excel',
      format: 'Excel',
    },
    {
      title: 'Status Summary Report',
      description: 'Breakdown of complaint statuses',
      icon: <TableViewIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      action: 'Download PDF',
      format: 'PDF',
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Reports & Export 📊
      </Typography>

      {/* Custom Report Generator */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Generate Custom Report
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="complaints">Complaints Report</MenuItem>
                <MenuItem value="ipc-sections">IPC Sections Report</MenuItem>
                <MenuItem value="analytics">Analytics Report</MenuItem>
                <MenuItem value="officer-performance">Officer Performance</MenuItem>
                <MenuItem value="status-summary">Status Summary</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="all-2024">All 2024 Complaints</MenuItem>
                <MenuItem value="jan-2024">January 2024</MenuItem>
                <MenuItem value="feb-2024">February 2024</MenuItem>
                <MenuItem value="mar-2024">March 2024</MenuItem>
                <MenuItem value="q1-2024">Q1 2024 (Jan-Mar)</MenuItem>
                <MenuItem value="q2-2024">Q2 2024 (Apr-Jun)</MenuItem>
                <MenuItem value="q3-2024">Q3 2024 (Jul-Sep)</MenuItem>
                <MenuItem value="q4-2024">Q4 2024 (Oct-Dec)</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Export Format"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                <MenuItem value="csv">CSV File</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DownloadIcon />}
                onClick={handleGenerateReport}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                Generate & Download Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Quick Reports */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Quick Reports
      </Typography>

      <Grid container spacing={3}>
        {quickReports.map((report, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  cursor: 'pointer',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {report.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {report.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2, minHeight: 40 }}
                >
                  {report.description}
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    report.action.includes('PDF') ? <PictureAsPdfIcon /> : <TableViewIcon />
                  }
                  onClick={() => handleQuickDownload(report.title, report.format)}
                >
                  {report.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Export Options */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Bulk Export Options
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<TableViewIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickDownload('All_Complaints_2024', 'Excel')}
              >
                Export All Complaints (Excel)
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<AssessmentIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickDownload('Analytics_Summary_2024', 'Excel')}
              >
                Export Analytics Data (CSV)
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<DownloadIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickDownload('Comprehensive_Report_2024', 'PDF')}
              >
                Comprehensive Report (Text)
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
