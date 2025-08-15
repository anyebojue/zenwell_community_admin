import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find as findFloor } from 'modules/property/houses/floor'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { QueryReportFeeDetailRoomReply } from 'api/model/property/report/queryReportFeeDetailRoomModel'

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
  const dispatch = useDispatch<AppDispatch>()
  const { list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const modifiedFloorList = [{ id: '', name: '全部' }, ...floorList]
  const [selectedButton, setSelectedButton] = useState<string>('')
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryReportFeeDetailRoomSlice
  )

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(findFloor, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const dynamicColumns =
    list?.[0]?.receivedOweFees?.map((fee: FeeItem) => ({
      field: fee.name || '未知费用',
      headerName: fee.name || '未知费用',
      flex: 1
    })) || []

  const columns = [
    { field: 'roomName', headerName: '房屋', flex: 1 },
    {
      field: 'ownerName',
      headerName: '业主',
      flex: 1,
      renderCell: ({ row }: { row: QueryReportFeeDetailRoomReply }) =>
        `${row.ownerName}/${row.link}`
    },
    { field: 'oweFee', headerName: '欠费', flex: 1 },
    { field: 'receivedFee', headerName: '实收', flex: 1 },
    ...dynamicColumns
  ]

  const rows = list.map((item: QueryReportFeeDetailRoomReply, index: number) => {
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
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '120px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {modifiedFloorList.map(item => (
            <Button
              key={item.id}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.id ? '#1976d2' : '#fff',
                color: selectedButton === item.id ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.id ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.id || '')}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
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
          rows={rows as QueryReportFeeDetailRoomReply[]}
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
      </Stack>
    </>
  )
}

export default memo(TableData)
