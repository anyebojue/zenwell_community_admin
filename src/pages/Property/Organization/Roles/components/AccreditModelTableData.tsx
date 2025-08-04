import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/platform/community'
import message from 'components/Message'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'

interface AccreditTableDataProps {
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const AccreditModelTableData: React.FC<AccreditTableDataProps> = ({ setSelectedRows }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)
  const { rolesGroupList } = useSelector((state: RootState) => state.RolesSlice)
  const defaultSelectedIds = rolesGroupList.map(item => String(item.communityId))
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(defaultSelectedIds)

  useEffect(() => {
    setSelectedRows(new Set(selectionModel.map(id => String(id))))
  }, [selectionModel, setSelectedRows])

  const handleRowSelection = useCallback((newSelection: GridRowSelectionModel) => {
    setSelectionModel(newSelection)
  }, [])

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
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '小区ID', width: 200 },
        { field: 'name', headerName: '小区名称', flex: 1 },
        { field: 'address', headerName: '小区地址', flex: 1 }
      ]}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={handleRowSelection}
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

export default memo(AccreditModelTableData)
