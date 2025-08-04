import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/platform/organization/employees'
import message from 'components/Message'
import { zhCN } from '@mui/x-data-grid/locales'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { RolesReply } from 'api/model/platform/organization/rolesModel'

interface AssociatedTableDataProps {
  dialogValue: RolesReply
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  dialogValue,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.EmployeesSlice)
  const defaultSelectedIds = dialogValue?.users
    ? dialogValue?.users.map(item => String(item.id))
    : []
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(defaultSelectedIds)

  useEffect(() => {
    setSelectedRows(new Set(selectionModel.map(id => String(id))))
  }, [dialogValue, selectionModel, setSelectedRows])

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
        { field: 'username', headerName: '员工名称', flex: 1 },
        { field: 'address', headerName: '员工地址', flex: 1 },
        { field: 'id', headerName: '员工编号', width: 200 }
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

export default memo(AssociatedTableData)
