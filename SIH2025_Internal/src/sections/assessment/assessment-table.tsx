import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';
import { GroundWaterAssessment } from 'src/types/GroundWaterAssessment';
import { UserTableHead } from 'src/sections/user/user-table-head';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { TableNoData } from 'src/sections/user/table-no-data';

import { AssessmentTableRow } from './assessment-table-row';
import { AssessmentTableToolbar } from './assessment-table-toolbar';

// ----------------------------------------------------------------------

type Props = {
  assessmentData: GroundWaterAssessment[];
  title?: string;
};

export function AssessmentTable({ assessmentData, title = "Ground Water Assessment Data" }: Props) {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  // Filter data based on search, state, and district
  const filteredData = useMemo(() =>
    assessmentData.filter((item) => {
      const matchesSearch =
        (item.assessmentUnitName ?? '')
          .toLowerCase()
          .includes(filterName.toLowerCase()) ||
        (item.district ?? '')
          .toLowerCase()
          .includes(filterName.toLowerCase()) ||
        (item.state ?? '')
          .toLowerCase()
          .includes(filterName.toLowerCase());


      const matchesState = selectedState === 'All States' || item.state === selectedState;
      const matchesDistrict = selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      return matchesSearch && matchesState && matchesDistrict;
    })
    , [assessmentData, filterName, selectedState, selectedDistrict]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    const comparator = getComparator(table.order, table.orderBy);
    return filteredData.sort(comparator);
  }, [filteredData, table.order, table.orderBy]);

  const notFound = !sortedData.length && (!!filterName || selectedState !== 'All States' || selectedDistrict !== 'All Districts');

  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
    table.onResetPage();
  }, [table]);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    table.onResetPage();
  }, [table]);

  const emptyRows = table.page > 0 ? Math.max(0, (1 + table.page) * table.rowsPerPage - sortedData.length) : 0;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Card>
        <AssessmentTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          assessmentData={assessmentData}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          onStateChange={handleStateChange}
          onDistrictChange={handleDistrictChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', maxWidth: '100%' }}>
            <Table sx={{ minWidth: 1200 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sortedData.length}
                onSort={table.onSort}
                headLabel={[
                  { id: 'assessmentUnitName', label: 'Assessment Unit' },
                  { id: 'state', label: 'State' },
                  { id: 'district', label: 'District' },
                  { id: 'assessmentUnitType', label: 'Type' },
                  { id: 'totalAnnualRecharge', label: 'Annual Recharge', align: 'right' },
                  { id: 'totalExtraction', label: 'Total Extraction', align: 'right' },
                  { id: 'netGwAvailability', label: 'Net GW Availability', align: 'right' },
                  { id: 'categorization', label: 'Category', align: 'center' },
                  { id: 'stageExtractionPercent', label: 'Extraction %', align: 'center' },
                ]}
              />
              <TableBody>
                {sortedData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AssessmentTableRow
                      key={row.id || `${row.state}-${row.district}-${row.assessmentUnitName}`}
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
  const [orderBy, setOrderBy] = useState('assessmentUnitName');
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
): (a: GroundWaterAssessment, b: GroundWaterAssessment) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a: GroundWaterAssessment, b: GroundWaterAssessment, orderBy: string) {
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
