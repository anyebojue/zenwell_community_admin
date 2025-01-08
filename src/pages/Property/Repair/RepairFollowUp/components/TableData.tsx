import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingReply } from 'api/model/property/repairSettingModel'
import { find } from 'modules/property/repairSetting'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Feedback, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = () => (
  <Box>
    {[
      {
        title: '回访',
        color: 'primary' as const,
        icon: <Feedback fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '详情',
        color: 'primary' as const,
        icon: <FileCopy fontSize="small" />,
        onClick: () => message.info('未实现')
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
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)

  const columns: Column<RepairSettingReply>[] = [
    { key: 'repairTypeName', headerName: '工单编码', align: 'center' },
    { key: 'repairTypeName', headerName: '位置', align: 'center' },
    { key: 'repairTypeName', headerName: '报修类型', align: 'center' },
    { key: 'repairTypeName', headerName: '报修人', align: 'center' },
    { key: 'repairTypeName', headerName: '联系方式', align: 'center' },
    { key: 'repairTypeName', headerName: '预约时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons()
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

  return <TableList rows={list} columns={columns} />
}

export default memo(TableData)
