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
  SelectChangeEvent
} from '@mui/material'
import { CommunityReply } from 'api/model/communityModel'
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

const TableDataGrid = ({
  rows,
  columns,
  setDialogValue
}: {
  rows: CommunityReply[]
  columns: Column<CommunityReply>[]
  setDialogValue: Dispatch<SetStateAction<CommunityReply | undefined>>
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const { page, paginatedRows, setPage, handlePageChange } = usePagination(rows, rowsPerPage)

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
    setPage(1)
  }

  return (
    <Box
      sx={theme => ({
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow
              sx={theme => ({
                backgroundColor: theme.palette.action.hover,
                '& th': {
                  fontWeight: 'bold',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  height: 45,
                  lineHeight: '45px'
                }
              })}
            >
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
            {paginatedRows.map((row: CommunityReply) => (
              <TableRow
                onClick={() => setDialogValue(row)}
                key={row.id}
                sx={theme => ({
                  backgroundColor:
                    theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                })}
              >
                {columns.map(column => {
                  const value = row[column.key as keyof CommunityReply]
                  return (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      {column.renderCell ? column.renderCell(value) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
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
            onChange={handleRowsPerPageChange} // 修正后的事件处理函数
            size="small"
            sx={{
              marginRight: 2,
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
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
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

export default memo(TableDataGrid)
