import {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply, OrgUserReply } from 'api/model/platform/organizationInfoModel'
import { deleteOrgUserByIds, findOrgUser } from 'modules/platform/organizationInfo'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Article, Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal from 'components/DeleteModal'
import TableList from './TableList'

const renderActionButtons = ({ setDelOpen }: { setDelOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <Box>
      {[
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
          onClick: () => setDelOpen(true)
        },
        {
          title: '退房',
          color: 'secondary' as const,
          icon: <Article fontSize="small" />,
          onClick: () => message.info('未实现')
        },
        {
          title: '交房',
          color: 'secondary' as const,
          icon: <Article fontSize="small" />,
          onClick: () => message.info('未实现')
        },
        {
          title: '业务受理',
          color: 'secondary' as const,
          icon: <Article fontSize="small" />,
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
}

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
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogUserValue,
  setDialogUserValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        findOrgUser({
          'page.num': page.num,
          'page.size': page.size,
          orgId: dialogValue.id || '9027438861059358721'
        })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size, dialogValue.id])

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return orgUserList
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.users?.username! }))
        .filter(item => item.id && item.name)
    }
    if (dialogUserValue) {
      return dialogUserValue.id && dialogUserValue.users?.username
        ? [{ id: dialogUserValue.id, name: dialogUserValue.users?.username }]
        : []
    }
    return []
  }, [selectedRows, orgUserList, dialogUserValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteOrgUserByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        fetchData()
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, fetchData]
  )

  const columns: Column<OrgUserReply>[] = [
    {
      key: 'users.username',
      headerName: '名称',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.username || '无用户名'
    },
    {
      key: 'users.mobile',
      headerName: '手机号',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.mobile || '无手机号'
    },
    {
      key: 'users.position',
      headerName: '岗位',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.position || '无岗位'
    },
    {
      key: 'users.address',
      headerName: '地址',
      align: 'center',
      renderCell: (row: OrgUserReply) => row.users?.address || '无地址'
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
      renderCell: () => renderActionButtons({ setDelOpen })
    }
  ]

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <TableList
        rows={orgUserList}
        columns={columns}
        setDialogUserValue={setDialogUserValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
    </>
  )
}

export default memo(TableData)
