
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { SelectChangeEvent } from '@mui/material/Select';

interface StateSelectorProps {
  availableStates: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
  label?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export function StateSelector({
  availableStates,
  selectedState,
  onStateChange,
  label = 'Select State',
  fullWidth = true,
  size = 'small'
}: StateSelectorProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onStateChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel id="state-selector-label">{label}</InputLabel>
      <Select
        labelId="state-selector-label"
        id="state-selector"
        value={selectedState}
        label={label}
        onChange={handleChange}
      >
        {availableStates.map((state) => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
