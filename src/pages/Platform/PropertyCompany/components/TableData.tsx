import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyCompanyReply } from 'api/model/platform/propertyCompanyModel'
import { find } from 'modules/platform/propertyCompany'
import { Tooltip, IconButton, Stack } from '@mui/material'
import { Block, Delete, Edit, ManageAccounts, RestartAlt, Login } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
  setDelOpen: Dispatch<SetStateAction<boolean>>
) => (
  <Stack width={110} direction="row" flexWrap="wrap">
    {[
      {
        title: '管理小区',
        color: 'primary' as const,
        icon: <ManageAccounts fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => setOpenDialog(true)
      },
      {
        title: '删除',
        color: 'error' as const,
        icon: <Delete fontSize="small" />,
        onClick: () => setDelOpen(true)
      },
      {
        title: '登录',
        color: 'success' as const,
        icon: <Login fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '限制登录',
        color: 'warning' as const,
        icon: <Block fontSize="small" />,
        onClick: () => message.info('未实现')
      },
      {
        title: '重置密码',
        color: 'info' as const,
        icon: <RestartAlt fontSize="small" />,
        onClick: () => message.info('未实现')
      }
    ].map((action, index) => (
      <Tooltip title={action.title} key={index}>
        <IconButton size="small" color={action.color} onClick={action.onClick}>
          {action.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Stack>
)

export interface Column<T> {
  headerName: string
  key: string
  align?: 'left' | 'right' | 'center'
  renderCell?: (_value: T[keyof T]) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<PropertyCompanyReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PropertyCompanySlice)

  const columns: Column<PropertyCompanyReply>[] = [
    { key: 'id', headerName: '编号', align: 'center' },
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'address', headerName: '地址', align: 'center' },
    { key: 'tel', headerName: '管理员', align: 'center' },
    { key: 'tel', headerName: '电话', align: 'center' },
    { key: 'storeTypeCd', headerName: '公司法人', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '成立日期', align: 'center' },
    { key: 'mapX', headerName: '地标', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons(setOpenDialog, setDelOpen)
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
