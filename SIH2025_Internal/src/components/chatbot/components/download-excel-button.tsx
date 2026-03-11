import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import * as XLSX from 'xlsx';

interface DownloadExcelButtonProps {
  data: any[];
  fileName?: string;
}

const DownloadExcelButton: React.FC<DownloadExcelButtonProps> = ({ 
  data, 
  fileName = 'query_result' 
}) => {
  // Check if data is empty or null
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
          borderRadius: 2,
          bgcolor: '#fff3e0',
          border: '1px solid #ffcc02',
          maxWidth: 'fit-content',
        }}
      >
        <ErrorOutlineIcon 
          sx={{ 
            color: '#f57c00',
            fontSize: '20px'
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#e65100',
            fontWeight: 500,
            fontSize: '14px'
          }}
        >
          No data found
        </Typography>
      </Box>
    );
  }

  const handleDownload = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      
      // Generate the Excel file and trigger download
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fullFileName = `${fileName}_${timestamp}.xlsx`;
      
      XLSX.writeFile(wb, fullFileName);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      startIcon={<DownloadIcon />}
      sx={{
        bgcolor: '#ffffff',
        color: '#5a6c7d',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        px: 2,
        py: 1,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        '&:hover': {
          bgcolor: '#f8f9fa',
          borderColor: '#b0bec5',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        },
        '&:active': {
          transform: 'translateY(1px)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      Download Excel
    </Button>
  );
};

export default DownloadExcelButton;