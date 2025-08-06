import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionTaskReply } from 'api/model/property/inspection/spectionTaskModel'
import { find } from 'modules/property/inspection/spectionTask'
import { find as findPlan } from 'modules/property/inspection/spectionPlan'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<SpectionTaskReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  0: '未开始',
  1: '进行中',
  2: '已完成'
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskSlice)

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
        ...(selectedButton !== '' && {
          inspectionPlanId: selectedButton
        })
      },
      '正在加载列表中，请稍后...'
    )
    fetchData(findPlan, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: SpectionTaskReply) => {
      switch (actionType) {
        case 'circulation':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'spection':
          setDialogValue(row)
          navigate('/inspection/InspectionTaskDetail', { state: { value: row } })
          break
      }
    },
    [setDialogValue, setOpenDialog, setDelOpen, setSelectedRows, navigate]
  )

  const renderActionButtons = (row: SpectionTaskReply) =>
    [
      { title: '流转', action: 'circulation' },
      { title: '删除', action: 'delete' },
      { title: '详情', action: 'spection' }
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
        {
          field: 'id',
          headerName: '任务编码',
          width: 150,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'inspectionPlanId',
          headerName: '巡检计划',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.spectionPlan?.inspectionPlanName
        },
        {
          field: 'planInsTime',
          headerName: '巡检开始/结束时间',
          width: 150,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'actInsTime',
          headerName: '实际巡检时间',
          width: 150,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'planUserName',
          headerName: '计划巡检人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'actUserName',
          headerName: '当前巡检人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'transferDesc',
          headerName: '转移描述',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'signType',
          headerName: '巡检方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'stateCd',
          headerName: '巡检状态',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知'} />
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 180,
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
