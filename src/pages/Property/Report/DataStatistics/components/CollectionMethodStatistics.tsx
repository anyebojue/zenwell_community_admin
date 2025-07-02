import { memo } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { Box, Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryReceivedWayStatisticsSlice
  )

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          position: 'absolute',
          top: '3%',
          right: '1.5%'
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Download />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => {
            if (exportUrl) {
              window.open(exportUrl, '_blank')
            } else {
              alert('暂无导出链接')
            }
          }}
        >
          导出
        </Button>
      </Box>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          { field: 'id', headerName: '现金', flex: 1 },
          { field: 'name', headerName: '微信二维码', flex: 1 },
          { field: 'primeRate', headerName: '支付宝二维码', flex: 1 },
          { field: 'receivedAmount', headerName: '押金退款到账户', flex: 1 }
        ]}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationMode="server"
        rowCount={Number(page.total)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: Number(page.size)
            }
          }
        }}
      />
    </>
  )
}

export default memo(TableData)
