import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeDetailReply } from 'api/model/property/feeConfig/payFeeDetailModel'
import { find } from 'modules/property/feeConfig/payFeeDetail'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PayFeeDetailSlice)

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
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback((actionType: string, row: PayFeeDetailReply) => {
    switch (actionType) {
      case 'discount':
        console.log(row)
        break
    }
  }, [])

  const renderActionButtons = (row: PayFeeDetailReply) =>
    [{ title: '折扣', action: 'discount' }].map(({ title, action }) => (
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
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'cycles', headerName: '周期(单位:月)', flex: 1 },
        { field: 'primeRate', headerName: '缴费方式', flex: 1 },
        { field: 'payableAmount', headerName: '应收金额(单位:元)', flex: 1 },
        { field: 'receivedAmount', headerName: '实收金额(单位:元)', flex: 1 },
        { field: 'createdAt', headerName: '缴费时间', flex: 1 },
        { field: 'startTime', headerName: '缴费起始时间', flex: 1 },
        { field: 'endTime', headerName: '缴费结束时间', flex: 1 },
        { field: 'cashierName', headerName: '收银员', flex: 1 },
        { field: 'statusCd', headerName: '状态', flex: 1 },
        { field: 'remark', headerName: '备注', flex: 1 },
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
