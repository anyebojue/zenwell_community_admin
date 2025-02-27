import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/feeConfig/feeImportDetail'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeImportDetailSlice)

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
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        {
          field: 'floorNum',
          headerName: '楼栋编号',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'unitNum',
          headerName: '单元编号',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'roomNum',
          headerName: '房屋编号',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'feeName',
          headerName: '费用名称',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'startTime',
          headerName: '开始时间',
          headerAlign: 'center',
          align: 'center',
          width: 180
        },
        {
          field: 'endTime',
          headerName: '结束时间',
          headerAlign: 'center',
          align: 'center',
          width: 180
        },
        { field: 'amount', headerName: '总金额', headerAlign: 'center', align: 'center', flex: 1 },
        { field: 'remark', headerName: '备注', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'stateCd',
          headerName: '状态',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: params => {
            return params.value === '1000' ? '导入成功' : '导入失败'
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
  )
}

export default memo(TableData)
