import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EmployeesReply } from 'api/model/platform/organization/employeesModel'
import { find } from 'modules/platform/organization/employees'
import { Chip } from '@mui/material'
import message from 'components/Message'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<EmployeesReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.EmployeesSlice)

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
    (actionType: string, row: EmployeesReply) => {
      switch (actionType) {
        case 'restartAlt':
          message.info('同步操作未实现')
          break
        case 'details':
          message.info('同步操作未实现')
          break
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: EmployeesReply) =>
    [
      { title: '重置密码', action: 'restartAlt' },
      { title: '详情', action: 'details' },
      { title: '修改', action: 'edit' },
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
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '员工编号', headerAlign: 'center', align: 'center', width: 200 },
        {
          field: 'username',
          headerName: '名称',
          headerAlign: 'center',
          align: 'center',
          width: 150
        },
        {
          field: 'mobile',
          headerName: '手机号',
          headerAlign: 'center',
          align: 'center',
          width: 150
        },
        {
          field: 'org',
          headerName: '关联组织',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) =>
            Array.isArray(row.org) && row.org.length > 0 ? row.org[0].name : '-'
        },
        { field: 'position', headerName: '岗位', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'idcard',
          headerName: '身份证',
          headerAlign: 'center',
          align: 'center',
          width: 200
        },
        { field: 'address', headerName: '地址', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'sex',
          headerName: '性别',
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (row.sex === 0 ? '女' : '男')
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 250,
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

export default memo(TableData)
