import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';

// ----------------------------------------------------------------------

type Props = {
  row: GroundWaterAssessment;
};

export function AssessmentTableRow({ row }: Props) {
  // Get color based on categorization
  const getCategorizationColor = (categorization: string) => {
    if (!categorization) return 'default';
    switch (categorization.toUpperCase()) {
      case 'SAFE':
        return 'success';
      case 'OVER_EXPLOITED':
      case 'OVER-EXPLOITED':
        return 'error';
      case 'CRITICAL':
        return 'warning';
      case 'SEMI_CRITICAL':
        return 'info';
      case 'SALINE':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(num);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell component="th" scope="row">
        {row.assessmentUnitName}
      </TableCell>

      <TableCell>{row.state}</TableCell>

      <TableCell>{row.district}</TableCell>

      <TableCell>{row.assessmentUnitType}</TableCell>

      <TableCell align="right">{formatNumber(row.totalAnnualRecharge)}</TableCell>

      <TableCell align="right">{formatNumber(row.totalExtraction)}</TableCell>

      <TableCell align="right">{formatNumber(row.netGwAvailability)}</TableCell>

      <TableCell align="center">
        <Label color={getCategorizationColor(row.categorization)}>
          {row.categorization ? row.categorization.replace('_', ' ') : 'N/A'}
        </Label>
      </TableCell>

      <TableCell align="center">
        {row.stageExtractionPercent != null ? `${row.stageExtractionPercent.toFixed(1)}%` : 'N/A'}
      </TableCell>
    </TableRow>
  );
}