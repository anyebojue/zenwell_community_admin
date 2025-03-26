import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/parkingBox'
import { find as findArea } from 'modules/property/parking/parkingArea'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ParkingBoxSlice)
  const { list: areaList } = useSelector((state: RootState) => state.ParkingAreaSlice)
  console.log(areaList)

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

  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '岗亭编号', flex: 1 },
        { field: 'boxName', headerName: '岗亭名称', flex: 1 },
        { field: 'area', headerName: '停车场', flex: 1 },
        { field: 'area', headerName: '临时车进场', flex: 1 },
        { field: 'area', headerName: '临时车审核', flex: 1 },
        { field: 'area', headerName: '是否收费', flex: 1 },
        { field: 'area', headerName: '已在场', flex: 1 },
        { field: 'area', headerName: '未在场', flex: 1 },
        { field: 'remark', headerName: '备注', flex: 1 }
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
