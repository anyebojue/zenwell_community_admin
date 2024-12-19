import { memo, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { find } from 'modules/platform/community'
import { Box, Tooltip, IconButton, Chip } from '@mui/material'
import { Edit, ExitToApp } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderStatusChip = (value: CommunityReply) => {
  const statusMap: Record<string, { label: string; color: 'success' | 'default' }> = {
    '': { label: '审核成功', color: 'success' },
    '0': { label: '未审核', color: 'default' }
  }

  const status = statusMap[String(value) || ''] || { label: '未知状态', color: 'default' }
  return <Chip label={status.label} color={status.color} size="small" />
}

const renderActionButtons = () => (
  <Box>
    {[
      {
        title: '退出小区',
        color: 'info' as const,
        icon: <ExitToApp fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '修改',
        color: 'primary' as const,
        icon: <Edit fontSize="small" />,
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

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '附近地标', align: 'center' },
    { key: 'cityCode', headerName: '城市编码', align: 'center' },
    {
      key: 'state',
      headerName: '状态',
      align: 'center',
      renderCell: value => renderStatusChip(value)
    },
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
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
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
