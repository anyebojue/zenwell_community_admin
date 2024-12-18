import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import { find } from 'modules/platform/roles'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Article, Delete } from '@mui/icons-material'
import message from 'components/Message'
import { RolesReply } from 'api/model/platform/rolesModel'
import RelevanceTableList from './RelevanceTableList'

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
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface RelevanceTableDataProps {
  dialogValue: RolesReply
  setDialogEmployessValue: Dispatch<SetStateAction<EmployeesReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const RelevanceTableData: React.FC<RelevanceTableDataProps> = ({
  dialogValue,
  setDialogEmployessValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RolesSlice)

  const columns: Column<EmployeesReply>[] = [
    { key: 'username', headerName: '名称', align: 'center' },
    { key: 'mobile', headerName: '手机号', align: 'center' },
    { key: 'address', headerName: '地址', align: 'center' },
    {
      key: 'sex',
      headerName: '性别',
      align: 'center',
      renderCell: (row: EmployeesReply) => (row?.sex === 0 ? '女' : '男')
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

  return (
    <RelevanceTableList
      rows={list.filter(item => item.id === dialogValue.id)[0].users || []}
      columns={columns}
      setDialogEmployessValue={setDialogEmployessValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(RelevanceTableData)
