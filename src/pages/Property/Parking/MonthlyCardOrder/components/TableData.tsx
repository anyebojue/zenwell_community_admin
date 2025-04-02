import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChargeMonthOrderReply } from 'api/model/property/parking/chargeMonthOrderModel'
import { find } from 'modules/property/parking/chargeMonthOrder'
import { find as findArea } from 'modules/property/parking/parkingArea'
import { Box, Chip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

const statusValue: Record<string, string> = {
  '1': '现金',
  '2': 'POS刷卡',
  '3': '微信二维码',
  '4': '支付宝二维码',
  '7': '转账'
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ChargeMonthOrderReply | undefined>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ChargeMonthOrderSlice)

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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    fetchData(findArea, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: ChargeMonthOrderReply) => {
      switch (actionType) {
        case 'refund':
          setDialogValue(row)
          break
      }
    },
    [setDialogValue]
  )

  const renderActionButtons = (row: ChargeMonthOrderReply) =>
    [{ title: '退款', action: 'refund' }].map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))

  return (
    <DataGrid
      sx={{
        mt: 2,
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        }
      }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'id', headerName: '订单编号', width: 180, headerAlign: 'center', align: 'center' },
        { field: '', headerName: '月卡', flex: 1, headerAlign: 'center', align: 'center' },
        { field: '', headerName: '车牌号', flex: 1, headerAlign: 'center', align: 'center' },
        { field: '', headerName: '车位', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'primeRate',
          headerName: '支付方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.primeRate!] || '未知'} />
        },
        {
          field: 'receivableAmount',
          headerName: '应收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'receivedAmount',
          headerName: '实收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'startTime',
          headerName: '有效期',
          minWidth: 190,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">{row.startTime}～</Typography>
              <Typography variant="body1">{row.endTime}</Typography>
            </Box>
          )
        },
        { field: '', headerName: '状态', flex: 1, headerAlign: 'center', align: 'center' },
        { field: '', headerName: '收银员', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'createdAt',
          headerName: '购买时间',
          width: 170,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
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
  )
}

export default memo(TableData)
