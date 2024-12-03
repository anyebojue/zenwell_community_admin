import { memo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import Box from '@mui/material/Box'
import { columns, rows } from './gridData'

const TableDataGrid = () => {
  return (
    <Box sx={{ height: 'calc(100vh - 200px)', pt: 1 }}>
      <DataGrid
        disableColumnMenu
        rows={rows}
        columns={columns}
        getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } }
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText} // 设置中文
      />
    </Box>
  )
}

export default memo(TableDataGrid)
