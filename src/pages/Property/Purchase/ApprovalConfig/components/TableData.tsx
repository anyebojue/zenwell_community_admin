import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WorkflowReply } from 'api/model/property/purchase/workflowModel'
import { find } from 'modules/property/purchase/workflow'
import { Box, Button, Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

const statusValue: Record<string, string> = {
  '10001': '采购流程',
  '10002': '领用流程',
  '10003': '调拨流程'
}

const statusCd: Record<string, string> = {
  '1001': '待部署',
  '2002': '已部署'
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<WorkflowReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
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
  const { page, list } = useSelector((state: RootState) => state.WorkflowSlice)

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
    (actionType: string, row: WorkflowReply) => {
      switch (actionType) {
        case 'deploy':
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

  const renderActionButtons = (row: WorkflowReply) => {
    const actions = [
      { title: '部署流程', action: 'deploy', status: '1001' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    return actions
      .filter(({ status }) => status === undefined || row.statusCd === status)
      .map(({ title, action }) => (
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
  }

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '编号', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'flowName',
          headerName: '流程名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <Box>
              {row.flowName}
              <Button variant="text" color="secondary">
                设置流程
              </Button>
            </Box>
          )
        },
        {
          field: 'flowType',
          headerName: '流程类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.flowType!] || '未知类型'} />
        },
        {
          field: 'statusCd',
          headerName: '流程状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusCd[row.statusCd!] || '未知类型'} />
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'describle', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
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

export default memo(TableData)
