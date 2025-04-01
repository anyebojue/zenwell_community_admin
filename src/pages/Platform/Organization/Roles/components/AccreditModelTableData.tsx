import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/platform/community'
import message from 'components/Message'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { Checkbox } from '@mui/material'

interface AccreditTableDataProps {
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const AccreditModelTableData: React.FC<AccreditTableDataProps> = ({ setSelectedRows }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)
  const { rolesGroupList } = useSelector((state: RootState) => state.RolesSlice)
  const checkboxId = rolesGroupList.map(item => item.communityId)

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

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  return (
    <DataGrid
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      getRowId={row => row.id || ''}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '小区ID', width: 200 },
        { field: 'name', headerName: '小区名称', flex: 1 },
        { field: 'address', headerName: '小区地址', flex: 1 }
      ]}
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
      isRowSelectable={params => !checkboxId.includes(params.row.id)}
      slots={{
        baseCheckbox: params => {
          return <Checkbox checked={params.disabled} disabled={params.disabled} />
        }
      }}
    />
  )
}

export default memo(AccreditModelTableData)
