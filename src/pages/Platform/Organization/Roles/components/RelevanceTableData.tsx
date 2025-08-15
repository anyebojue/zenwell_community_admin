import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/platform/organization/roles'
import { Chip } from '@mui/material'
import message from 'components/Message'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { useNavigate } from 'react-router-dom'

interface RelevanceTableDataProps {
  dialogValue: RolesReply
  setDelOpen: Dispatch<SetStateAction<boolean>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const RelevanceTableData: React.FC<RelevanceTableDataProps> = ({
  dialogValue,
  setDelOpen,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RolesSlice)

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

  const handleActionClick = useCallback(
    (actionType: string, row: RolesReply) => {
      switch (actionType) {
        case 'details':
          navigate('/organization/EmployeesDetails', { state: { value: row } })
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [navigate, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: RolesReply) =>
    [
      { title: '详情', action: 'details' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: '-5px',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))

  return (
    <DataGrid
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list.filter(item => item.id === dialogValue.id)[0]?.users || []}
      columns={[
        { field: 'username', headerName: '名称', flex: 1 },
        { field: 'mobile', headerName: '手机号', flex: 1 },
        { field: 'address', headerName: '地址', flex: 1 },
        {
          field: 'sex',
          headerName: '性别',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) => (row?.sex === 0 ? '女' : '男')
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
        }
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
    />
  )
}

export default memo(RelevanceTableData)
