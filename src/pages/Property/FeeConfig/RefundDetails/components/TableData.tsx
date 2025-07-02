import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/feeConfig/payFeeDetail'
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

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        {
          field: 'cycles',
          headerName: '周期(单位:月)',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'primeRate',
          headerName: '缴费方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.primeRate === 1
              ? '现金'
              : row.primeRate === 2
                ? 'POS刷卡'
                : row.primeRate === 3
                  ? '微信二维码'
                  : row.primeRate === 4
                    ? '支付宝二维码'
                    : row.primeRate === 7
                      ? '转账'
                      : '其他'
        },
        {
          field: 'payableAmount',
          headerName: '应收金额(单位:元)',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'receivedAmount',
          headerName: '实收金额(单位:元)',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createdAt',
          headerName: '缴费时间',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'startTime',
          headerName: '缴费起始时间',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'endTime',
          headerName: '缴费结束时间',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'cashierName',
          headerName: '收银员',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'statusCd', headerName: '状态', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' }
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
