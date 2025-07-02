import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/queryReportOwnerPayFee'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.QueryReportOwnerPayFeeSlice)

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
    fetchData(
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findFeeConfig,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'ownerName', headerName: '业主', flex: 1 },
        { field: 'roomName', headerName: '房屋', flex: 1 },
        { field: 'feeName', headerName: '费用项目', flex: 1 },
        {
          field: '1',
          headerName: '1月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 1)
          }
        },
        {
          field: '2',
          headerName: '2月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 2)
          }
        },
        {
          field: '3',
          headerName: '3月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 3)
          }
        },
        {
          field: '4',
          headerName: '4月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 4)
          }
        },
        {
          field: '5',
          headerName: '5月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 5)
          }
        },
        {
          field: '7',
          headerName: '7月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 7)
          }
        },
        {
          field: '8',
          headerName: '8月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 8)
          }
        },
        {
          field: '9',
          headerName: '9月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 9)
          }
        },
        {
          field: '10',
          headerName: '10月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 10)
          }
        },
        {
          field: '11',
          headerName: '11月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 11)
          }
        },
        {
          field: '12',
          headerName: '12月',
          flex: 1,
          renderCell: ({ row }) => {
            return row.reportOwnerPayFeeDtos?.map(item => item.pfMonth === 12)
          }
        },
        { field: 'total', headerName: '合计', flex: 1 },
        { field: 'row', headerName: '应收', flex: 1 },
        { field: 'records', headerName: '预收', flex: 1 }
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
