import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityAnnouncementReply } from 'api/model/property/communityAnnouncementModel'
import { find } from 'modules/property/communityAnnouncement'
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
  selectedButton: number
  setDialogValue: Dispatch<SetStateAction<CommunityAnnouncementReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page, list } = useSelector((state: RootState) => state.CommunityAnnouncementSlice)

  const columns: Column<CommunityAnnouncementReply>[] = [
    { key: 'photo', headerName: '头部照片', align: 'center' },
    { key: 'title', headerName: '公示标题', align: 'center' },
    { key: 'type', headerName: '公示类型', align: 'center' },
    { key: 'createdAt', headerName: '公示时间', align: 'center' },
    { key: 'communityId', headerName: '发布人', align: 'center' },
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
      const current_community = localStorage.getItem('current_community')
      let communityId
      if (current_community) {
        communityId = JSON.parse(current_community).id
      } else {
        communityId = info.community[0].id
      }
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, communityId, type: selectedButton })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, info.community, page.num, page.size, selectedButton])

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
