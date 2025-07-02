import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/carInout'
import { find as findArea } from 'modules/property/parking/parkingArea'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  selectedButton: string
}

const TableData: React.FC<TableDataProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CarInoutSlice)

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
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { paId: selectedButton })
      },
      '正在加载列表中，请稍后...'
    )
    fetchData(findArea, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size, selectedButton])

  return (
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
      rows={list}
      columns={[
        { field: 'id', headerName: '进出场编号', flex: 1 },
        { field: '', headerName: '车辆状态', flex: 1 },
        { field: 'carNum', headerName: '车牌号', flex: 1 },
        { field: '', headerName: '停车场', flex: 1 },
        { field: '', headerName: '计费规则', flex: 1 },
        { field: '', headerName: '车牌类型', flex: 1 },
        { field: 'inTime', headerName: '进场时间', flex: 1 },
        { field: 'outTime', headerName: '出场时间', flex: 1 },
        { field: '', headerName: '停车时间', flex: 1 },
        { field: '', headerName: '收费金额', flex: 1 },
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
