import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/queryHuaningOweFeeDetail'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.QueryHuaningOweFeeDetailSlice)
  const today = new Date()

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
      { 'page.num': page.num, 'page.size': page.size, objType: '6666' },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'roomName', headerName: '房号', flex: 1 },
        { field: 'builtUpArea', headerName: '面积', flex: 1 },
        { field: 'feeName', headerName: '费用', flex: 1 },
        { field: 'endTime', headerName: '费用开始时间', flex: 1 },
        { field: 'deadlineTime', headerName: '费用截止时间', flex: 1 },
        { field: 'oweAmount', headerName: '总未收金额', flex: 1 },
        {
          field: 'curOweAmount',
          headerName: `${today.getFullYear()}年${today.getMonth() - 1}-${today.getMonth() + 1}月 未收金额`,
          flex: 1
        },
        { field: 'preOweAmount', headerName: `${today.getFullYear()}年前未收金额`, flex: 1 }
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
