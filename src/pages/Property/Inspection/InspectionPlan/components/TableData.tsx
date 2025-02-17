import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionPlanReply } from 'api/model/property/inspection/spectionPlanModel'
import { find, update } from 'modules/property/inspection/spectionPlan'
import {
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material'
import { Delete, Block, Edit, FileCopy, WarningRounded, PlayArrow } from '@mui/icons-material'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import { buttonStyles } from 'components/DeleteModal'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: SpectionPlanReply | undefined
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<SpectionPlanReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  setDialogType,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.SpectionPlanSlice)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const columns: Column<SpectionPlanReply>[] = [
    { key: 'inspectionPlanName', headerName: '计划名称', align: 'center' },
    {
      key: 'spectionRoute',
      headerName: '计划路线',
      align: 'center',
      renderCell: row => row.spectionRoute?.name
    },
    {
      key: 'inspectionPlanPeriod',
      headerName: '计划周期',
      align: 'center',
      renderCell: row => (row.status === 1 ? '月/日' : row.status === 2 ? '按周' : '')
    },
    {
      key: 'signType',
      headerName: '签到方式',
      align: 'center',
      renderCell: row =>
        row.status === 0 ? '现场定位' : row.status === 1 ? '现场拍照(默认定位)' : ''
    },
    {
      key: 'startDate',
      headerName: '日期范围',
      align: 'center',
      renderCell: row => `${row.startDate} - ${row.endDate}`
    },
    {
      key: 'startTime',
      headerName: '时间范围',
      align: 'center',
      renderCell: row => `${row.startTime} - ${row.endTime}`
    },
    { key: 'beforeTime', headerName: '任务提前（分钟）', align: 'center' },
    { key: 'communityId', headerName: '制定人', align: 'center' },
    { key: 'createdAt', headerName: '制定时间', align: 'center' },
    {
      key: 'status',
      headerName: '状态',
      align: 'center',
      renderCell: row => (row.status === 0 ? '禁用' : row.status === 1 ? '启用' : '')
    },
    { key: 'createUserName', headerName: '巡检人员', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Box>
          {[
            {
              title: '修改',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => {
                setOpenDialog(true)
                setDialogType('edit')
              }
            },
            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            },
            {
              title: row.status === 0 ? '启用' : '停用',
              color: 'primary' as const,
              icon: row.status === 0 ? <PlayArrow fontSize="small" /> : <Block fontSize="small" />,
              onClick: () => setOpen(true)
            },
            {
              title: '详情',
              color: 'primary' as const,
              icon: <FileCopy fontSize="small" />,
              onClick: () =>
                navigate('/inspection/inspection-plan-detail', { state: { value: row } })
            }
          ].map((action, index) => (
            <Tooltip title={action.title} key={index}>
              <IconButton size="small" color={action.color} onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const action = update({ id: dialogValue?.id, status: dialogValue?.status === 0 ? 1 : 0 })
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      fetchData()
      message.success(dialogValue?.status === 0 ? '启用成功' : '停用成功')
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
      <TableList
        rows={list}
        columns={columns}
        setDialogValue={setDialogValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          <span style={{ margin: '10px' }}>{dialogValue?.status === 1 ? '停用' : '启用'}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            你确定{dialogValue?.status === 1 ? '停用' : '启用'}巡检计划么？
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
