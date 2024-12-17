import { memo, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesUserReply } from 'api/model/platform/rolesModel'
import { findRolesUser } from 'modules/platform/roles'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './AccreditTableList'

const renderActionButtons = () => (
  <Box>
    {[
      {
        title: '删除',
        color: 'error' as const,
        icon: <Delete fontSize="small" />,
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
  key: string
  align?: 'left' | 'right' | 'center'
  renderCell?: (value: T[keyof T]) => ReactNode
}

const TableData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, rolesUserList } = useSelector((state: RootState) => state.RolesSlice)

  const columns: Column<RolesUserReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '附近地标', align: 'center' },
    { key: 'cityCode', headerName: '城市编码', align: 'center' },
    { key: 'bId', headerName: '社区编码', align: 'center' },
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
      await dispatch(findRolesUser({ 'page.num': page.num, 'page.size': page.size }))
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return <TableList rows={rolesUserList} columns={columns} />
}

export default memo(TableData)
