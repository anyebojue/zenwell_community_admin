import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingReply } from 'api/model/property/repair/repairSettingModel'
import { find } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

const statusValue: Record<string, string> = {
  '100': '维修单',
  '200': '保洁单'
}

const repairValue: Record<string, string> = {
  '100': '抢单',
  '200': '指派',
  '300': '轮训'
}

const repairSettingValue: Record<string, string> = {
  '0': '微信',
  '1': '短信',
  '2': '微信+员工工牌'
}

const VisitFlagValue: Record<string, string> = {
  '1': '不回访',
  '2': '已评价不回访',
  '3': '回访'
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<RepairSettingReply | undefined>>
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
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)

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
    (actionType: string, row: RepairSettingReply) => {
      switch (actionType) {
        case 'binding':
          setDialogValue(row)
          navigate('/repair/RepairStaff', { state: { value: row } })
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
    [navigate, setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: RepairSettingReply) =>
    [
      { title: '绑定维修师傅', action: 'binding' },
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
        { field: 'repairTypeName', headerName: '类型名称', flex: 1 },
        {
          field: 'repairType',
          headerName: '报修设置类型',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.repairType!] || '未知'} />
        },
        {
          field: 'repairWay',
          headerName: '派单方式',
          flex: 1,
          renderCell: ({ row }) => <Chip label={repairValue[row.repairWay!] || '未知'} />
        },
        { field: 'publicArea', headerName: '区域', flex: 1 },
        { field: 'isShow', headerName: '业主端展示', flex: 1 },
        {
          field: 'repairSettingType',
          headerName: '通知方式',
          flex: 1,
          renderCell: ({ row }) => (
            <Chip label={repairSettingValue[row.repairSettingType!] || '未知'} />
          )
        },
        {
          field: 'returnVisitFlag',
          headerName: '是否回访',
          flex: 1,
          renderCell: ({ row }) => <Chip label={VisitFlagValue[row.returnVisitFlag!] || '未知'} />
        },
        { field: 'createdAt', headerName: '创建时间', width: 180 },
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
