import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/report/queryHuaningPayFee'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.QueryHuaningPayFeeSlice)

  const list = useMemo(
    () => [
      {
        td: [
          {
            list: [
              { key: '0', name: '楼栋号', val: 'M8' },
              { key: '1', name: '每月应收', val: '4.6138' },
              { key: '2', name: '3月实收', val: '1096.1984' },
              { key: '3', name: '3月实收中属于2025年1-2月部分', val: '0' }
            ]
          },
          {
            list: [
              { key: '0', name: '楼栋号', val: 'M77' },
              { key: '1', name: '每月应收', val: '0' },
              { key: '2', name: '3月实收', val: '0' },
              { key: '3', name: '3月实收中属于2025年1-2月部分', val: '0' }
            ]
          }
        ],
        th: [
          { key: '0', name: '楼栋号' },
          { key: '1', name: '每月应收' },
          { key: '2', name: '3月实收' },
          { key: '3', name: '3月实收中属于2025年1-2月部分' }
        ]
      }
    ],
    []
  )

  const rows = useMemo(() => {
    return list[0]?.td.map((item, index) => {
      const rowData = item.list.reduce(
        (acc: Record<string, string>, cur) => {
          acc[cur.name] = cur.val
          return acc
        },
        {} as Record<string, string>
      )
      return { id: index, ...rowData }
    })
  }, [list])

  const columns = useMemo(() => {
    return list[0]?.th.map(item => ({
      field: item.name,
      headerName: item.name,
      flex: 1
    }))
  }, [list])

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
      { 'page.num': page.num, 'page.size': page.size, objType: '3333' },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={rows}
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
  )
}

export default memo(TableData)
