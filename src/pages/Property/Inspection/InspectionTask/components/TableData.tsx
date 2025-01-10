import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
import { find } from 'modules/property/repairPool'
import { find as findRepairSetting } from 'modules/property/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, SwapHoriz, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  selectedButton: number
  setDialogValue: Dispatch<SetStateAction<RepairPoolReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  console.log(list)

  const columns: Column<RepairPoolReply>[] = [
    { key: 'repairObjName', headerName: '工单编码', align: 'center' },
    { key: 'repairObjName', headerName: '任务编码', align: 'center' },
    { key: 'repairObjName', headerName: '巡检计划', align: 'center' },
    { key: 'repairObjName', headerName: '巡检人 开始/结束时间', align: 'center' },
    { key: 'repairObjName', headerName: '实际巡检时间', align: 'center' },
    { key: 'repairObjName', headerName: '计划巡检人', align: 'center' },
    { key: 'repairObjName', headerName: '当前巡检人', align: 'center' },
    { key: 'repairObjName', headerName: '转移描述', align: 'center' },
    { key: 'repairObjName', headerName: '巡检方式', align: 'center' },
    { key: 'repairObjName', headerName: '巡检状态', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '流转',
              color: 'secondary' as const,
              icon: <SwapHoriz fontSize="small" />,
              onClick: () => setOpenDialog(true)
            },
            {
              title: '详情',
              color: 'primary' as const,
              icon: <FileCopy fontSize="small" />,
              onClick: () => message.info('未实现')
            },

            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
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
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, statusCd: selectedButton })
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
  }, [dispatch, page.num, page.size, selectedButton])

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
    <TableList
      rows={list}
      columns={columns}
      setDialogValue={setDialogValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(TableData)
