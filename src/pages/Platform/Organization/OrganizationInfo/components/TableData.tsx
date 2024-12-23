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
import { Box, Tooltip, IconButton, Theme, Typography, Stack, Button } from '@mui/material'
import { Add, Article, Delete, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import TableList from './TableList'

const renderActionButtons = ({ setDelOpen }: { setDelOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
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

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const buttonCommonStyle = (
  color: string = '#2660ad',
  colorActive: string = '#1d428a',
  height: string = '32px'
) => ({
  ...buttonStyles(color, colorActive),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

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
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogUserValue,
  setDialogUserValue,
  selectedRows,
  setSelectedRows,
  setAssociatedOpen
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
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{dialogValue.name} 员工</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<FileCopy />}
              sx={buttonCommonStyle()}
            >
              文档
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonCommonStyle()}
              onClick={() => setAssociatedOpen(true)}
            >
              关联员工
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={buttonCommonStyle('#B22222', '#8B0000')}
              onClick={() => {
                if (![...selectedRows].length) {
                  return message.warning('请选择至少一项')
                }
                setDelOpen(true)
              }}
            >
              批量删除
            </Button>
          </Stack>
        </Box>
        <TableList
          rows={orgUserList}
          columns={columns}
          setDialogUserValue={setDialogUserValue}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </Box>
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
