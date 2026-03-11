import { useState, useCallback, useMemo } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { Iconify } from 'src/components/iconify';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  assessmentData: GroundWaterAssessment[];
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
};

export function AssessmentTableToolbar({
  filterName,
  onFilterName,
  assessmentData,
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
}: Props) {
  // Get available states
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(assessmentData.map(item => item.state))).sort();
    return ['All States', ...states];
  }, [assessmentData]);

  // Get available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All States') {
      const districts = Array.from(new Set(assessmentData.map(item => item.district))).sort();
      return ['All Districts', ...districts];
    }
    const districts = Array.from(
      new Set(
        assessmentData
          .filter(item => item.state === selectedState)
          .map(item => item.district)
      )
    ).sort();
    return ['All Districts', ...districts];
  }, [assessmentData, selectedState]);

  const handleStateChange = useCallback((event: SelectChangeEvent<string>) => {
    const newState = event.target.value;
    onStateChange(newState);
    // Reset district when state changes
    onDistrictChange('All Districts');
  }, [onStateChange, onDistrictChange]);

  const handleDistrictChange = useCallback((event: SelectChangeEvent<string>) => {
    onDistrictChange(event.target.value);
  }, [onDistrictChange]);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 3, 0, 3),
        width: '100%',
      }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search assessment units..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={handleStateChange}
            >
              {availableStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>District</InputLabel>
            <Select
              value={selectedDistrict}
              label="District"
              onChange={handleDistrictChange}
            >
              {availableDistricts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Toolbar>
  );
}