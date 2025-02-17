import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationRecordReply } from 'api/model/property/communitys/roomRenovationRecordModel'
import { find } from 'modules/property/communitys/roomRenovationRecord'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import message from 'components/Message'
import { RoomRenovationReply } from 'api/model/property/communitys/roomRenovationModel'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  value: RoomRenovationReply
  setDialogValue: Dispatch<SetStateAction<RoomRenovationRecordReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  value,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RoomRenovationRecordSlice)

  const columns: Column<RoomRenovationRecordReply>[] = [
    { key: 'rId', headerName: '装修跟踪记录ID', align: 'center' },
    { key: 'id', headerName: '房屋', align: 'center', renderCell: () => value.roomName },
    { key: 'staffName', headerName: '操作人员', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'status',
      headerName: '状态',
      align: 'center',
      renderCell: () => '待审核(原始图片)'
    },
    {
      key: 'statusCd',
      headerName: '是否违规',
      align: 'center',
      renderCell: row => (row.statusCd === 0 ? '正常' : '违规')
    },
    { key: 'remark', headerName: '备注', align: 'center' },
    {
      key: 'img',
      headerName: '图片',
      align: 'center',
      renderCell: row => <img style={{ height: '100px' }} src={row.img} alt={row.img} />
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
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
