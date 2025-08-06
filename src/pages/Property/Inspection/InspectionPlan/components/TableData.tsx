import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionPlanReply } from 'api/model/property/inspection/spectionPlanModel'
import { find, update } from 'modules/property/inspection/spectionPlan'
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import { WarningRounded } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface TableDataProps {
  dialogValue: SpectionPlanReply | undefined
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<SpectionPlanReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusType: Record<string, string> = {
  0: '现场定位',
  1: '现场拍照(默认定位)'
}

const statusValue: Record<string, string> = {
  0: '禁用',
  1: '启用'
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.SpectionPlanSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
    (actionType: string, row: SpectionPlanReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'status':
          setDialogValue(row)
          setOpen(true)
          break
        case 'spection':
          setDialogValue(row)
          navigate('/inspection/InspectionPlanDetail', { state: { value: row } })
          break
      }
    },
    [navigate, setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: SpectionPlanReply) =>
    [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' },
      { title: '状态', action: 'status' },
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

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const action = update({
        id: dialogValue?.id,
        status: dialogValue?.status === '0' ? '1' : '0'
      })
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
      message.success(dialogValue?.status === '0' ? '启用成功' : '停用成功')
      setOpen(false)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          { field: 'id', headerName: '计划ID', width: 180, headerAlign: 'center', align: 'center' },
          {
            field: 'inspectionPlanName',
            headerName: '计划名称',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'spectionRoute.name',
            headerName: '计划路线',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.spectionRoute?.name
          },
          {
            field: 'inspectionPlanPeriod',
            headerName: '计划周期',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'signType',
            headerName: '签到方式',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusType[row.signType!] || '未知'} />
          },
          {
            field: 'startDate',
            headerName: '日期范围',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'startTime',
            headerName: '时间范围',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'beforeTime',
            headerName: '任务提前（分钟）',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'communityId',
            headerName: '制定人',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => community.name
          },
          {
            field: 'createdAt',
            headerName: '制定时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'status',
            headerName: '状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.status!] || '未知'} />
          },
          {
            field: 'createUserName',
            headerName: '巡检人员',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          <span style={{ margin: '10px' }}>{dialogValue?.status === '1' ? '停用' : '启用'}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            你确定{dialogValue?.status === '1' ? '停用' : '启用'}巡检计划么？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
            onClick={handleSubmit}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(TableData)
