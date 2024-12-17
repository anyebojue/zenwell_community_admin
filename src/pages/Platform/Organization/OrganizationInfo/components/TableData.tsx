import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply, OrgUserReply } from 'api/model/platform/organizationInfoModel'
import { findOrgUser } from 'modules/platform/organizationInfo'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Article, Delete } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

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

interface TableDataProps {
  dialogValue: OrganizationInfoReply
  dialogUserValue: OrgUserReply
  setDialogUserValue: Dispatch<SetStateAction<OrgUserReply>>
}

const TableData: React.FC<TableDataProps> = ({ dialogValue, setDialogUserValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)

  const columns: Column<OrgUserReply>[] = [
    {
      key: 'users.username',
      headerName: '名称',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.username
    },
    {
      key: 'users.mobile',
      headerName: '手机号',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.mobile
    },
    {
      key: 'users.position',
      headerName: '岗位',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.position
    },
    {
      key: 'users.address',
      headerName: '地址',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.address
    },
    {
      key: 'users.sex',
      headerName: '性别',
      align: 'center',
      renderCell: (row: OrgUserReply) => (row.users?.sex === 0 ? '女' : '男')
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
      await dispatch(
        findOrgUser({
          'page.num': page.num,
          'page.size': page.size,
          orgId: dialogValue.id || '9027438861059358721'
        })
      )
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size, dialogValue.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return <TableList rows={orgUserList} columns={columns} setDialogUserValue={setDialogUserValue} />
}

export default memo(TableData)
