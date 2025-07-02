import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import {
  SwapHoriz,
  Undo,
  CheckCircle,
  PauseCircle,
  FileCopy,
  PlayCircle
} from '@mui/icons-material'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import TableList from './TableList'
import TransferOfOrder from './TransferOfOrder'
import Chargeback from './Chargeback'
import Pause from './Pause'
import Launch from './Launch'
import Conclude from './Conclude'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [dialogValue, setDialogValue] = useState<RepairPoolReply | undefined>()
  const [transferOpen, setTransferOpen] = useState(false)
  const [chargebackOpen, setChargebackOpen] = useState(false)
  const [concludeOpen, setConcludeOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)

  const columns: Column<RepairPoolReply>[] = [
    { key: 'communityId', headerName: '位置', align: 'center', renderCell: () => community.name },
    {
      key: 'repairSetting',
      headerName: '报修类型',
      align: 'center',
      renderCell: row => row.repairSetting?.repairTypeName
    },
    { key: 'repairName', headerName: '报修人', align: 'center' },
    { key: 'tel', headerName: '报修人电话', align: 'center' },
    { key: 'appointmentTime', headerName: '预约时间', align: 'center' },
    {
      key: 'statusCd',
      headerName: '状态',
      align: 'center',
      renderCell: row =>
        row.statusCd === 1000
          ? '未派单'
          : row.statusCd === 1100
            ? '接单'
            : row.statusCd === 1200
              ? '退单'
              : row.statusCd === 1300
                ? '转单'
                : row.statusCd === 1400
                  ? '申请支付'
                  : row.statusCd === 1500
                    ? '支付失败'
                    : row.statusCd === 1700
                      ? '待评价'
                      : row.statusCd === 1800
                        ? '电话回访'
                        : row.statusCd === 1900
                          ? '办理完成'
                          : row.statusCd === 2000
                            ? '未办理结单'
                            : row.statusCd === 2001
                              ? '暂停'
                              : ''
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => {
        const actions = [
          {
            title: '转单',
            color: 'primary' as const,
            icon: <SwapHoriz fontSize="small" />,
            onClick: () => setTransferOpen(true)
          },
          {
            title: '退单',
            color: 'primary' as const,
            icon: <Undo fontSize="small" />,
            onClick: () => setChargebackOpen(true)
          },
          {
            title: '办结',
            color: 'primary' as const,
            icon: <CheckCircle fontSize="small" />,
            onClick: () => setConcludeOpen(true)
          },
          {
            title: '暂停',
            color: 'primary' as const,
            icon: <PauseCircle fontSize="small" />,
            onClick: () => setPauseOpen(true)
          },
          {
            title: '启动',
            color: 'primary' as const,
            icon: <PlayCircle fontSize="small" />,
            onClick: () => setActivateOpen(true)
          },
          {
            title: '详情',
            color: 'primary' as const,
            icon: <FileCopy fontSize="small" />,
            onClick: () => navigate('/repair/work-order-details', { state: { value: row } })
          }
        ]
        const filteredActions = actions.filter(action => {
          if (row.statusCd === 2001) {
            return ['启动', '详情'].includes(action.title)
          }
          return action.title !== '启动'
        })
        return (
          <Box>
            {filteredActions.map((action, index) => (
              <Tooltip title={action.title} key={index}>
                <IconButton size="small" color={action.color} onClick={action.onClick}>
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )
      }
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, statusCd: 1100 })
      )
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

  const fetchRepairSettingData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        findRepairSetting({ 'page.num': page.num, 'page.size': page.size })
      )
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
    fetchRepairSettingData()
  }, [fetchData, fetchRepairSettingData])

  return (
    <>
      <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
      <TransferOfOrder
        dialogValue={dialogValue}
        transferOpen={transferOpen}
        setTransferOpen={setTransferOpen}
      />
      <Chargeback
        dialogValue={dialogValue}
        chargebackOpen={chargebackOpen}
        setChargebackOpen={setChargebackOpen}
      />
      <Conclude
        dialogValue={dialogValue}
        concludeOpen={concludeOpen}
        setConcludeOpen={setConcludeOpen}
      />
      <Pause dialogValue={dialogValue} pauseOpen={pauseOpen} setPauseOpen={setPauseOpen} />
      <Launch
        dialogValue={dialogValue}
        activateOpen={activateOpen}
        setActivateOpen={setActivateOpen}
      />
    </>
  )
}

export default memo(TableData)
