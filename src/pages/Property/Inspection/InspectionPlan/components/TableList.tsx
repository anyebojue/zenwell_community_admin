import { memo, useState, useMemo, ChangeEvent, Dispatch, SetStateAction } from 'react'
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  SelectChangeEvent,
  Checkbox,
  Theme
} from '@mui/material'
import { SpectionPlanReply } from 'api/model/property/spectionPlanModel'
import { Column } from './TableData'

const usePagination = <T,>(data: T[], rowsPerPage: number) => {
  const [page, setPage] = useState(1)
  const paginatedRows = useMemo(
    () => data.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [data, page, rowsPerPage]
  )
  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)
  return { page, paginatedRows, setPage, handlePageChange }
}

const TableList = ({
  rows,
  columns,
  setDialogValue,
  selectedRows,
  setSelectedRows
}: {
  rows: SpectionPlanReply[]
  columns: Column<SpectionPlanReply>[]
  setDialogValue: Dispatch<SetStateAction<SpectionPlanReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}) => {
  const [rowsPerPage, setRowsPerPage] = useState('20')
  const { page, paginatedRows, setPage, handlePageChange } = usePagination(
    rows,
    Number(rowsPerPage)
  )

  const tableHeaderStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.action.hover,
    '& th': {
      fontWeight: 'bold',
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: 45,
      lineHeight: '45px'
    }
  })

  const tableRowStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  })

  const handleRowsPerPageChange = (event: SelectChangeEvent<string>) => {
    setRowsPerPage(event.target.value)
    setPage(1)
  }

  const onSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(event.target.checked ? new Set(rows.map(row => row.id)) : new Set())
  }

  const onSelectRow = (id: string | undefined) => {
    setSelectedRows(prev =>
      prev.has(id) ? new Set([...prev].filter(rowId => rowId !== id)) : new Set(prev).add(id)
    )
  }

  const allSelected = selectedRows.size === rows.length && rows.length > 0
  const someSelected = selectedRows.size > 0 && selectedRows.size < rows.length

  const renderValue = (value: SpectionPlanReply[keyof SpectionPlanReply] | undefined) => {
    if (Array.isArray(value)) {
      return JSON.stringify(value)
    } else if (value && typeof value === 'object') {
      return JSON.stringify(value)
    } else {
      return value || '-'
    }
  }

  return (
    <Box
      sx={theme => ({
        mt: 3,
        width: '100%',
        borderRadius: '7px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      })}
    >
      <TableContainer
        component={Paper}
        sx={theme => ({
          backgroundColor:
            theme.palette.mode === 'light' ? 'white' : theme.palette.background.default
        })}
      >
        <Table sx={{ minWidth: 650 }} aria-label="data table" size="small">
          <TableHead>
            <TableRow sx={tableHeaderStyle}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={onSelectAll}
                  inputProps={{ 'aria-label': 'select all rows' }}
                />
              </TableCell>
              {columns.map(column => (
                <TableCell
                  key={column.headerName}
                  align={column.align}
                  sx={theme => ({
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.divider}`
                  })}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map(row => (
                <TableRow onClick={() => setDialogValue(row)} key={row.id} sx={tableRowStyle}>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={selectedRows.has(row.id)}
                      onChange={() => onSelectRow(row.id)}
                      inputProps={{ 'aria-label': `select row ${row.id}` }}
                    />
                  </TableCell>
                  {columns.map(column => {
                    const value = row[column.key as keyof SpectionPlanReply]
                    return (
                      <TableCell
                        key={column.key}
                        align={column.align}
                        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                      >
                        {column.renderCell ? column.renderCell(row) : renderValue(value)}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '10px 10px'
        }}
      >
        <Typography variant="body2" sx={{ marginLeft: 2 }}>
          共 {rows.length} 项数据
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ marginRight: 1 }}>
            每页行数:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            sx={{
              marginRight: 3,
              border: 'none',
              boxShadow: 'none',
              '.MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                padding: 0
              }
            }}
          >
            {[10, 20, 50].map(size => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          <Pagination
            count={Math.ceil(rows.length / Number(rowsPerPage))}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default memo(TableList)
