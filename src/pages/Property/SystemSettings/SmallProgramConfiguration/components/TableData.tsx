import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { find } from 'modules/platform/community'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
  setDelOpen: Dispatch<SetStateAction<boolean>>
) => (
  <Box>
    {[
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

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<CommunityReply | undefined>>
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
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: 'APPID', align: 'center' },
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'nearbyLandmarks', headerName: '应用密钥', align: 'center' },
    { key: 'cityCode', headerName: '描述', align: 'center' },

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
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
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
