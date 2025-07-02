import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairStaffReply } from 'api/model/property/repair/repairStaffModel'
import { find } from 'modules/property/repair/repairStaff'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<RepairStaffReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairStaffSlice)

  const columns: Column<RepairStaffReply>[] = [
    { key: 'id', headerName: '维修师傅ID', align: 'center' },
    { key: 'staffName', headerName: '师傅名称', align: 'center' },
    {
      key: 'repairSetting',
      headerName: '报修类型',
      align: 'center',
      renderCell: row => row.repairSetting?.repairTypeName
    },
    {
      key: 'statusCd',
      headerName: '状态',
      align: 'center',
      renderCell: row => (row.statusCd === 99 ? '在线' : row.statusCd === 88 ? '离线' : '')
    },
    { key: 'remark', headerName: '说明', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '变更',
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

  return <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
}

export default memo(TableData)
