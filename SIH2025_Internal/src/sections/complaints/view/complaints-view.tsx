import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { Label } from 'src/components/label';
import { enhancedComplaintData, EnhancedComplaint } from 'src/_mock/enhanced-complaint-data';

// ----------------------------------------------------------------------

export function ComplaintsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedComplaint, setSelectedComplaint] = useState<EnhancedComplaint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredComplaints = useMemo(() => {
    let filtered = enhancedComplaintData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaintDescription.toLowerCase().includes(query) ||
          complaint.complainantName.toLowerCase().includes(query) ||
          complaint.location.toLowerCase().includes(query) ||
          (complaint.ipcSection && complaint.ipcSection.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter((complaint) => complaint.priority === priorityFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter, priorityFilter]);

  const paginatedComplaints = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredComplaints.slice(start, start + rowsPerPage);
  }, [filteredComplaints, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (complaint: EnhancedComplaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Complaint Management 📋
      </Typography>

      <Card>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search complaints..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Solved">Solved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="All">All Priority</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Showing {filteredComplaints.length} complaints
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Complainant</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>IPC Section</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedComplaints.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(complaint)}
                  >
                    <TableCell>{complaint.sNo}</TableCell>
                    <TableCell>{complaint.complainantName}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {complaint.complaintDescription.substring(0, 60)}...
                    </TableCell>
                    <TableCell>
                      {complaint.ipcSection && (
                        <Chip label={complaint.ipcSection} size="small" color="primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Label color={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label color={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Label>
                    </TableCell>
                    <TableCell>{complaint.submittedDate}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(complaint);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filteredComplaints.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedComplaint && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h6">Complaint #{selectedComplaint.sNo}</Typography>
                <Label color={getStatusColor(selectedComplaint.status)}>
                  {selectedComplaint.status}
                </Label>
                <Label color={getPriorityColor(selectedComplaint.priority)}>
                  {selectedComplaint.priority} Priority
                </Label>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Complainant Name</Typography>
                  <Typography variant="body1">{selectedComplaint.complainantName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedComplaint.location}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted Date</Typography>
                  <Typography variant="body1">{selectedComplaint.submittedDate}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">IPC Section</Typography>
                  <Chip label={selectedComplaint.ipcSection || 'N/A'} color="primary" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedComplaint.complaintDescription}</Typography>
                </Grid>
                {selectedComplaint.assignedTo && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
                    <Typography variant="body1">{selectedComplaint.assignedTo}</Typography>
                  </Grid>
                )}
                {selectedComplaint.remarks && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Remarks</Typography>
                    <Typography variant="body2" sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                      {selectedComplaint.remarks}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardContent>
  );
}
