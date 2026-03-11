import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';
import { Complaint } from 'src/types/Complaint';
import { UserTableHead } from 'src/sections/user/user-table-head';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { TableNoData } from 'src/sections/user/table-no-data';

import { ComplaintTableRow } from './complaint-table-row';

// ----------------------------------------------------------------------

type Props = {
  complaintData: Complaint[];
  title?: string;
};

export function ComplaintTable({ complaintData, title = "User Complaint Data" }: Props) {
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  // Filter data based on search
  const filteredData = useMemo(() =>
    complaintData.filter((item) => {
      const matchesSearch =
        item.complaintDescription.toLowerCase().includes(filterName.toLowerCase()) ||
        item.status.toLowerCase().includes(filterName.toLowerCase()) ||
        item.submittedDate.includes(filterName);

      return matchesSearch;
    })
    , [complaintData, filterName]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    const comparator = getComparator(table.order, table.orderBy);
    return filteredData.sort(comparator);
  }, [filteredData, table.order, table.orderBy]);

  const notFound = !sortedData.length && !!filterName;

  const emptyRows = table.page > 0 ? Math.max(0, (1 + table.page) * table.rowsPerPage - sortedData.length) : 0;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', maxWidth: '100%' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sortedData.length}
                onSort={table.onSort}
                headLabel={[
                  { id: 'sNo', label: 'S.No', align: 'center' },
                  { id: 'complaintDescription', label: 'Complaint Description' },
                  { id: 'submittedDate', label: 'Submitted Date' },
                  { id: 'status', label: 'Status', align: 'center' },
                ]}
              />
              <TableBody>
                {sortedData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ComplaintTableRow
                      key={row.id}
                      row={row}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={sortedData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('sNo');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}

// Comparator function for sorting
function getComparator(
  order: 'asc' | 'desc',
  orderBy: string
): (a: Complaint, b: Complaint) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a: Complaint, b: Complaint, orderBy: string) {
  const aValue = (a as any)[orderBy];
  const bValue = (b as any)[orderBy];

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}
