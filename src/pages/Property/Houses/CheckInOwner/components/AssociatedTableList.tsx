import { memo, useState, useMemo, ChangeEvent, ReactNode } from 'react'
import { HousingManagementReply } from 'api/model/property/houses/floorModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
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
  Theme
} from '@mui/material'
import { UnitReply } from 'api/model/property/houses/unitModel'
import { Column } from './AssociatedTableData'

const usePagination = <T,>(data: T[], rowsPerPage: number) => {
  const [page, setPage] = useState(1)
  const paginatedRows = useMemo(
    () => data.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [data, page, rowsPerPage]
  )
  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)
  return { page, paginatedRows, setPage, handlePageChange }
}

const AssociatedTableList = ({
  rows,
  columns
}: {
  rows: HousingManagementReply[] | RoomReply[]
  columns: Column<RoomReply>[] | Column<HousingManagementReply>[]
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const { page, paginatedRows, setPage, handlePageChange } = usePagination<(typeof rows)[0]>(
    rows,
    rowsPerPage
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

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
    setPage(1)
  }

  const renderValue = (
    value:
      | string
      | number
      | HousingManagementReply
      | RoomReply[]
      | UnitReply
      | UnitReply[]
      | undefined
  ): ReactNode => {
    if (Array.isArray(value)) {
      return value.map(item => JSON.stringify(item)).join(', ')
    } else if (value && typeof value === 'object') {
      if ('status' in value && typeof value.status === 'number') {
        return JSON.stringify({
          ...value,
          status: value.status.toString()
        })
      }
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
                <TableRow onClick={() => {}} key={row.id} sx={tableRowStyle}>
                  {columns.map(column => {
                    const value = row[column.key as keyof typeof row]
                    return (
                      <TableCell
                        key={column.key}
                        align={column.align}
                        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                      >
                        {column.renderCell
                          ? column.renderCell(row as RoomReply & HousingManagementReply)
                          : renderValue(value)}
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
            count={Math.ceil(rows.length / rowsPerPage)}
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

export default memo(AssociatedTableList)
