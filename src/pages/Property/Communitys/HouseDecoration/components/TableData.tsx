import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationReply } from 'api/model/property/roomRenovationModel'
import { find } from 'modules/property/roomRenovation'
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
  setDialogValue: Dispatch<SetStateAction<RoomRenovationReply | undefined>>
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
  const { page, list } = useSelector((state: RootState) => state.RoomRenovationSlice)

  const columns: Column<RoomRenovationReply>[] = [
    { key: 'roomName', headerName: '房屋', align: 'center' },
    { key: 'personName', headerName: '联系人', align: 'center' },
    { key: 'personTel', headerName: '联系电话', align: 'center' },
    {
      key: 'startTime',
      headerName: '装修时间',
      align: 'center',
      renderCell: row => `${row.startTime}-${row.endTime}`
    },
    { key: 'createdAt', headerName: '申请时间', align: 'center' },
    { key: 'renovationCompany', headerName: '装修单位', align: 'center' },
    { key: 'personMain', headerName: '装修负责人', align: 'center' },
    { key: 'personMainTel', headerName: '负责人电话', align: 'center' },
    {
      key: 'status',
      headerName: '状态',
      align: 'center',
      renderCell: row =>
        row.status === 1000
          ? '待审核'
          : row.status === 2000
            ? '审核不通过'
            : row.status === 3000
              ? '装修中'
              : row.status === 4000
                ? '待验收'
                : row.status === 5000
                  ? '验收成功'
                  : row.status === 6000
                    ? '验收失败'
                    : ''
    },
    {
      key: 'isPostpone',
      headerName: '是否延期',
      align: 'center',
      renderCell: row => (row.isPostpone === 0 ? '正常' : '延期')
    },
    { key: 'postponeTime', headerName: '延期时间', align: 'center' },
    {
      key: 'isViolation',
      headerName: '是否违规',
      align: 'center',
      renderCell: row => (row.isViolation === 0 ? '正常' : '违规')
    },
    { key: 'violationDesc', headerName: '违规说明', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
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
