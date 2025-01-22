import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpacePersonReply } from 'api/model/property/spacePersonModel'
import { find, update } from 'modules/property/spacePerson'
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
import { Cancel, WarningRounded } from '@mui/icons-material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: SpacePersonReply
  setDialogValue: Dispatch<SetStateAction<SpacePersonReply>>
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpacePersonSlice)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const columns: Column<SpacePersonReply>[] = [
    {
      key: 'space',
      headerName: '场馆',
      align: 'center',
      renderCell: row => row.space?.venue?.name
    },
    {
      key: 'spaceId',
      headerName: '场地',
      align: 'center',
      renderCell: row => row.space?.name
    },
    { key: 'personName', headerName: '预约人', align: 'center' },
    { key: 'personTel', headerName: '预约电话', align: 'center' },
    { key: 'appointmentTime', headerName: '预约日期', align: 'center' },
    { key: 'hours', headerName: '预约时间', align: 'center' },
    { key: 'receivableAmount', headerName: '应收金额', align: 'center' },
    { key: 'receivedAmount', headerName: '实收金额', align: 'center' },
    {
      key: 'payWay',
      headerName: '支付方式',
      align: 'center',
      renderCell: row =>
        row.payWay === 1 ? '现金' : row.payWay === 2 ? '微信' : row.payWay === 3 ? '支付宝' : ''
    },
    {
      key: 'stateCd',
      headerName: '状态',
      align: 'center',
      renderCell: row =>
        row.stateCd === 1
          ? '预约成功'
          : row.stateCd === 2
            ? '预约失败'
            : row.stateCd === 3
              ? '待审核'
              : row.stateCd === 4
                ? '待支付'
                : ''
    },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row =>
        row.stateCd !== 5 && (
          <Box>
            {[
              {
                title: '取消预约',
                color: 'error' as const,
                icon: <Cancel fontSize="small" />,
                onClick: () => setOpen(true)
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
      const action = update({ id: dialogValue?.id, stateCd: 5 })
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      fetchData()
      message.success('取消成功')
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
      <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          请确认您的操作!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定取消场地预约人，如果是线上预约，自动会退款到预约人账户
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
