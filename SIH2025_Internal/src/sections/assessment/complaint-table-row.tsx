import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { Complaint } from 'src/types/Complaint';

// ----------------------------------------------------------------------

type Props = {
  row: Complaint;
};

export function ComplaintTableRow({ row }: Props) {
  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell align="center">{row.sNo}</TableCell>

      <TableCell>{row.complaintDescription}</TableCell>

      <TableCell>{row.submittedDate}</TableCell>

      <TableCell align="center">
        <Label color={getStatusColor(row.status)}>
          {row.status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
