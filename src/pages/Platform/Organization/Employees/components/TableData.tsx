import { memo, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import { find } from 'modules/platform/employees'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Article, Edit, RestartAlt } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = () => (
  <Box>
    {[
      {
        title: '重置密码',
        color: 'info' as const,
        icon: <RestartAlt fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '详情',
        color: 'primary' as const,
        icon: <Article fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => message.info('未实现')
      },
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
  renderCell?: (_value: T[keyof T]) => ReactNode
}

const TableData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.EmployeesSlice)

  const columns: Column<EmployeesReply>[] = [
    { key: 'id', headerName: '员工编号', align: 'center' },
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '手机号', align: 'center' },
    { key: 'cityCode', headerName: '关联组织', align: 'center' },
    { key: 'bId', headerName: '岗位', align: 'center' },
    { key: 'bId', headerName: '身份证', align: 'center' },
    { key: 'bId', headerName: '地址', align: 'center' },
    { key: 'bId', headerName: '性别', align: 'center' },
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
