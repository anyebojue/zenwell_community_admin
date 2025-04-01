import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportCustomComponentReply } from 'api/model/platform/reportConfiguration/reportCustomComponentModel'
import { find } from 'modules/platform/reportConfiguration/reportCustomComponent'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

const statusValue: Record<string, string> = {
  '1001': '表格',
  '2002': '饼状图',
  '3003': 'input',
  '4004': 'select',
  '5005': '日期'
}

const statusType: Record<string, string> = {
  '1': 'sql',
  '2': 'go'
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ReportCustomComponentReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ReportCustomComponentSlice)

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
    (actionType: string, row: ReportCustomComponentReply) => {
      switch (actionType) {
        case 'settings':
          navigate('/reportConfiguration/SetCondition', { state: { value: row } })
          break
        case 'statistics':
          navigate('/reportConfiguration/BottomStatistics', { state: { value: row } })
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ReportCustomComponentReply) =>
    [
      { title: '设置条件', action: 'settings' },
      { title: '底部统计', action: 'statistics' },
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
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '组件ID', flex: 1 },
        { field: 'name', headerName: '组件名称', flex: 1 },
        {
          field: 'componentType',
          headerName: '组件类型',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.componentType!] || '未知'} />
        },
        {
          field: 'queryModel',
          headerName: '查询方式',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusType[row.queryModel!] || '未知'} />
        },
        { field: 'remark', headerName: '描述', flex: 1 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 280,
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
