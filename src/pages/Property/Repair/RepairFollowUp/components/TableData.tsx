import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Feedback, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import TableList from './TableList'
import ReturnVisitFlag from './ReturnVisitFlag'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: RepairPoolReply | undefined
  setDialogValue: Dispatch<SetStateAction<RepairPoolReply | undefined>>
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [returnVisitFlag, setReturnVisitFlag] = useState(false)

  const columns: Column<RepairPoolReply>[] = [
    { key: 'id', headerName: '工单编码', align: 'center' },
    { key: 'communityId', headerName: '位置', align: 'center', renderCell: () => community.name },
    {
      key: 'repairSetting',
      headerName: '报修类型',
      align: 'center',
      renderCell: row => row.repairSetting?.repairTypeName
    },
    { key: 'repairName', headerName: '报修人', align: 'center' },
    { key: 'tel', headerName: '联系方式', align: 'center' },
    { key: 'appointmentTime', headerName: '预约时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => {
        const actions = []
        if (row.repairReturnVisit?.id === '0') {
          actions.push({
            title: '回访',
            color: 'primary' as const,
            icon: <Feedback fontSize="small" />,
            onClick: () => setReturnVisitFlag(true)
          })
        }
        actions.push({
          title: '详情',
          color: 'primary' as const,
          icon: <FileCopy fontSize="small" />,
          onClick: () => navigate('/repair/work-order-details', { state: { value: row } })
        })
        return (
          <Box>
            {actions.map((action, index) => (
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
        find({ 'page.num': page.num, 'page.size': page.size, repairType: '1' })
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
      <ReturnVisitFlag
        dialogValue={dialogValue}
        returnVisitFlag={returnVisitFlag}
        setReturnVisitFlag={setReturnVisitFlag}
      />
    </>
  )
}

export default memo(TableData)
