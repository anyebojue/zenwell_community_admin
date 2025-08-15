import { memo } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { Box, Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { QueryReportFeeDetailCarReply } from 'api/model/property/report/queryReportFeeDetailCarModel'

interface TableDataProps {}

interface FeeData {
  [key: string]: number | string
}

interface FeeItem {
  name?: string
  oweFee?: string | number
  receivedFee?: string | number
}

const TableData: React.FC<TableDataProps> = () => {
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryReportFeeDetailCarSlice
  )

  const dynamicColumns =
    list?.[0]?.receivedOweFees?.map((fee: FeeItem) => ({
      field: fee.name || '未知费用',
      headerName: fee.name || '未知费用',
      flex: 1
    })) || []

  const columns = [
    { field: 'carNum', headerName: '车辆', flex: 1 },
    {
      field: 'ownerName',
      headerName: '业主',
      flex: 1,
      renderCell: ({ row }: { row: QueryReportFeeDetailCarReply }) => `${row.ownerName}/${row.link}`
    },
    { field: 'oweFee', headerName: '欠费', flex: 1 },
    { field: 'receivedFee', headerName: '实收', flex: 1 },
    ...dynamicColumns
  ]

  const rows = list.map((item: QueryReportFeeDetailCarReply, index: number) => {
    const feeData = item.receivedOweFees?.reduce((acc: FeeData, fee) => {
      if (fee.name) {
        acc[fee.name] = `${fee.oweFee}/${fee.receivedFee}`
      }
      return acc
    }, {} as FeeData)

    return { id: item.id || index, ...item, ...feeData }
  })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          position: 'absolute',
          top: '4%',
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
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2'
          }
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={rows as QueryReportFeeDetailCarReply[]}
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
    </>
  )
}

export default memo(TableData)
