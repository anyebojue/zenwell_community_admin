import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionItemReply } from 'api/model/property/spectionItemModel'
import { find } from 'modules/property/spectionItem'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (
  setDialogType: Dispatch<SetStateAction<string>>,
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
  setDelOpen: Dispatch<SetStateAction<boolean>>
) => (
  <Box>
    {[
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => {
          setOpenDialog(true)
          setDialogType('edit')
        }
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
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<SpectionItemReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionItemSlice)

  const columns: Column<SpectionItemReply>[] = [
    { key: 'id', headerName: '题目ID', align: 'center' },
    { key: 'name', headerName: '题目', align: 'center' },
    {
      key: 'titleType',
      headerName: '题目类型',
      align: 'center',
      renderCell: row =>
        row.titleType === 1
          ? '单选'
          : row.titleType === 2
            ? '多选'
            : row.titleType === 3
              ? '简答题'
              : '-'
    },
    { key: 'seq', headerName: '顺序', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons(setDialogType, setOpenDialog, setDelOpen)
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
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
