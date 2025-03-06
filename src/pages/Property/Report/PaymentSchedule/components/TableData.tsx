import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/queryPayFeeDetail'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.QueryPayFeeDetailSlice)

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
      find,
      { 'page.num': page.num, 'page.size': page.size, objType: '3333', isExport: true },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
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
        { field: 'oId', headerName: '订单号', flex: 1 },
        {
          field: 'objName',
          headerName: '房号/业主',
          flex: 1,
          renderCell: ({ row }) => `${row.payerObjName} / ${row.ownerName}`
        },
        {
          field: 'feeTypeCdName',
          headerName: '费用类型>费用项',
          flex: 1,
          renderCell: ({ row }) => `${row.feeTypeCdName} > ${row.feeName}`
        },
        { field: 'stateName', headerName: '费用状态', flex: 1 },
        { field: 'primeRate', headerName: '支付方式', flex: 1 },
        {
          field: 'feeStartTime',
          headerName: '缴费时间段',
          flex: 1,
          renderCell: ({ row }) => `${row.startTime} - ${row.endTime}`
        },
        { field: 'createTime', headerName: '缴费时间', flex: 1 },
        { field: 'cashierName', headerName: '收银员', flex: 1 },
        {
          field: 'receivableAmount',
          headerName: '应缴/应收金额(元)',
          flex: 1,
          renderCell: ({ row }) => `${row.payableAmount} / ${row.receivableAmount}`
        },
        { field: 'receivedAmount', headerName: '实收金额(元)', flex: 1 },
        { field: 'withholdAmount', headerName: '账户抵扣(元)', flex: 1 },
        {
          field: 'preferentialAmount',
          headerName: '优惠/减免金额(元)',
          flex: 1,
          renderCell: ({ row }) => `${row.preferentialAmount} / ${row.deductionAmount}`
        },
        { field: 'giftAmount', headerName: '赠送金额(元)', flex: 1 },
        { field: 'lateFee', headerName: '滞纳金(元)', flex: 1 },
        { field: 'builtUpArea', headerName: '面积(平方米)', flex: 1 },
        { field: 'psName', headerName: '车位', flex: 1 },
        { field: 'remark', headerName: '说明', flex: 1 }
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
