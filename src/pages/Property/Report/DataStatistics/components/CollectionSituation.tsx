import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: FeeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const modifiedFeeConfigTypeList = [{ id: '', name: '全部' }, ...FeeConfigTypeList]
  const [selectedButton, setSelectedButton] = useState<string>('')
  const { page, list, exportUrl } = useSelector(
    (state: RootState) => state.QueryDataReportFeeStatisticsSlice
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
    fetchData(
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size, objType: '3333', isExport: true },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          position: 'absolute',
          top: '2%',
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
          {modifiedFeeConfigTypeList.map(item => (
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
            },
            mt: 1
          }}
          localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnResize
          disableVirtualization={false}
          rows={list}
          columns={[
            {
              field: 'floorNum',
              headerName: '楼栋',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'roomCount',
              headerName: '户数',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'feeRoomCount',
              headerName: '收费户',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'hisMonthOweFee',
              headerName: '历史欠费',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'oweFee',
              headerName: '总欠费',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'todayReceivedRoomCount',
              headerName: '本日已交户数',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'todayReceivedRoomAmount',
              headerName: '本日已交金额',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'hisOweReceivedRoomCount',
              headerName: '历史欠费清缴户',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'hisOweReceivedRoomAmount',
              headerName: '历史欠费清缴金额',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'monthReceivedRoomCount',
              headerName: '本月已收户数',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'feeRoomCount',
              headerName: '剩余户数',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) =>
                (Number(row.feeRoomCount) - Number(row.monthReceivedRoomCount)).toFixed(0)
            },
            {
              field: 'monthReceivedRoomCount',
              headerName: '已收户占比',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => {
                const feeRoomCount = Number(row.feeRoomCount || 0)
                const monthReceived = Number(row.monthReceivedRoomCount || 0)
                return feeRoomCount > 0
                  ? `${((monthReceived / feeRoomCount) * 100).toFixed(2)}%`
                  : '0%'
              }
            },
            {
              field: 'monthReceivedRoomAmount',
              headerName: '当月已收金额',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'curMonthOweFee',
              headerName: '当月剩余未收',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'curReceivableFee',
              headerName: '收费率',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) => {
                const curReceivable = Number(row.curReceivableFee || 0)
                const monthReceived = Number(row.monthReceivedRoomAmount || 0)
                return curReceivable > 0
                  ? `${((monthReceived / curReceivable) * 100).toFixed(2)}%`
                  : '0%'
              }
            }
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
      </Stack>
    </>
  )
}

export default memo(TableData)
