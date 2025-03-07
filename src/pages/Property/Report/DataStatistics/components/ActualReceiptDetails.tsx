import { memo } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { Box, Button, Typography } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { QueryReceivedStatisticsReply } from 'api/model/property/report/queryReceivedStatisticsModel'
import { QueryReceivedDetailStatisticsReply } from 'api/model/property/report/queryReceivedDetailStatisticsModel'

interface TableDataProps {}

interface FeeData {
  [key: string]: number | string
}

interface FeeItem {
  key?: string
  val?: string | number
}

const TableData: React.FC<TableDataProps> = () => {
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryReceivedStatisticsSlice
  )

  const dynamicColumns =
    list?.[0]?.receivedFees?.map((fee: FeeItem) => ({
      field: fee.key || '未知费用',
      headerName: fee.key || '未知费用',
      flex: 1
    })) || []

  const columns = [
    { field: 'roomName', headerName: '房屋', flex: 1 },
    {
      field: 'ownerName',
      headerName: '业主',
      flex: 1,
      renderCell: ({ row }: { row: QueryReceivedDetailStatisticsReply }) =>
        `${row.ownerName}(${row.link})`
    },
    { field: 'receivedFee', headerName: '实收', flex: 1 },
    ...dynamicColumns
  ]

  const rows = list.map((item: QueryReceivedStatisticsReply, index: number) => {
    const feeData = item.receivedFees?.reduce((acc: FeeData, fee) => {
      if (fee.key) {
        acc[fee.key] = fee.val ?? ''
      }
      return acc
    }, {} as FeeData)

    return { id: item.floorId || index, ...item, ...feeData }
  })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          position: 'absolute',
          top: '5%',
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
        rows={rows as QueryReceivedDetailStatisticsReply[]}
        columns={columns}
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
      <Typography variant="body1" sx={{ mt: 1, ml: 1 }}>
        总实收：1848.20
      </Typography>
    </>
  )
}

export default memo(TableData)
