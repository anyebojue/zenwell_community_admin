import { memo, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { find } from 'modules/platform/community'
import { Box, Chip, Tooltip, IconButton } from '@mui/material'
import { Article, Delete } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderStatusChip = (value: string | number | undefined) => {
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
        title: '详情',
        color: 'primary' as const,
        icon: <Article fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '删除',
        color: 'error' as const,
        icon: <Delete fontSize="small" />,
        onClick: () => message.info('同步操作未实现')
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
  key: string
  align?: 'left' | 'right' | 'center'
  renderCell?: (_value: T[keyof T]) => ReactNode
}

const TableData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '附近地标', align: 'center' },
    { key: 'cityCode', headerName: '城市编码', align: 'center' },
    { key: 'bId', headerName: '社区编码', align: 'center' },
    {
      key: 'state',
      headerName: '状态',
      align: 'center',
      renderCell: (value: string | number | undefined) => renderStatusChip(value)
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
