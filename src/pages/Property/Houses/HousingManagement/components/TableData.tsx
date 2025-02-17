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
import { RoomReply } from 'api/model/property/houses/roomModel'
import { deleteByIds, find } from 'modules/property/houses/room'
import { Box, Tooltip, IconButton, Chip } from '@mui/material'
import { Delete, Edit, ExitToApp, House, Key } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal from 'components/DeleteModal'
import { HousingManagementReply } from 'api/model/property/houses/housingManagementModel'
import { useNavigate } from 'react-router-dom'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: HousingManagementReply
  dialogRoomValue: RoomReply
  setDialogRoomValue: Dispatch<SetStateAction<RoomReply>>
  setOpenRoomDialog: Dispatch<SetStateAction<boolean>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  delRoomOpen: boolean
  setDelRoomOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogRoomValue,
  setDialogRoomValue,
  setOpenRoomDialog,
  selectedRows,
  setSelectedRows,
  delRoomOpen,
  setDelRoomOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RoomSlice)

  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          ...(dialogValue.name ? { floorId: dialogValue.id } : { unitId: dialogValue.id })
        })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dialogValue.id, dialogValue.name, dispatch, page.num, page.size])

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.roomNum! }))
        .filter(item => item.id && item.name)
    }
    if (dialogRoomValue) {
      return dialogRoomValue.id && dialogRoomValue.roomNum
        ? [{ id: dialogRoomValue.id, name: dialogRoomValue.roomNum }]
        : []
    }
    return []
  }, [selectedRows, list, dialogRoomValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelRoomOpen(false)
        message.success('删除成功')
        fetchData()
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, fetchData, setDelRoomOpen]
  )

  const columns: Column<RoomReply>[] = [
    {
      key: 'roomNum',
      headerName: '房屋',
      align: 'center',
      renderCell: row => `${row.unit?.floor?.name}-${row.unit?.unitNum}-${row.roomNum}`
    },
    {
      key: 'layer',
      headerName: '楼层',
      align: 'center'
    },
    {
      key: 'layer',
      headerName: '业主',
      align: 'center'
    },
    {
      key: 'roomSubType',
      headerName: '类型',
      align: 'center',
      renderCell: row => {
        return row.roomSubType === '110' ? (
          <Chip label="住宅" />
        ) : row.roomSubType === '120' ? (
          <Chip label="办公室" />
        ) : row.roomSubType === '119' ? (
          <Chip label="宿舍" />
        ) : row.roomSubType === '128' ? (
          <Chip label="储物间" />
        ) : (
          <Chip label="其他" />
        )
      }
    },
    {
      key: 'builtUpArea',
      headerName: '建筑/室内面积',
      align: 'center',
      renderCell: row => `${row.builtUpArea} / ${row.roomArea}`
    },
    {
      key: 'roomRent',
      headerName: '租金',
      align: 'center'
    },
    {
      key: 'state',
      headerName: '房屋状态',
      align: 'center',
      renderCell: row => {
        return row.roomSubType === '2001' ? (
          <Chip label="已入住" />
        ) : row.roomSubType === '2002' ? (
          <Chip label="未销售" />
        ) : row.roomSubType === '2003' ? (
          <Chip label="已交房" />
        ) : row.roomSubType === '2004' ? (
          <Chip label="未入住" />
        ) : row.roomSubType === '2005' ? (
          <Chip label="已装修" />
        ) : row.roomSubType === '2006' ? (
          <Chip label="已出租" />
        ) : row.roomSubType === '2007' ? (
          <Chip label="已出售" />
        ) : row.roomSubType === '2008' ? (
          <Chip label="空闲" />
        ) : row.roomSubType === '2009' ? (
          <Chip label="装修中" />
        ) : (
          <Chip label="其他" />
        )
      }
    },
    {
      key: 'createdAt',
      headerName: '入住时间',
      align: 'center'
    },
    {
      key: 'layer',
      headerName: '业主成员',
      align: 'center'
    },
    {
      key: 'layer',
      headerName: '业主车辆',
      align: 'center'
    },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => {
        const actions = [
          {
            title: '修改',
            color: 'secondary' as const,
            icon: <Edit fontSize="small" />,
            onClick: () => setOpenRoomDialog(true)
          },
          {
            title: '删除',
            color: 'error' as const,
            icon: <Delete fontSize="small" />,
            onClick: () => setDelRoomOpen(true)
          },
          {
            title: row.userId !== '-1' ? '退房' : '交房',
            color: 'secondary' as const,
            icon: row.userId !== '-1' ? <ExitToApp fontSize="small" /> : <Key fontSize="small" />,
            onClick: () =>
              row.userId !== '-1'
                ? navigate('/houses/CheckOut', { state: { value: row } })
                : navigate('/houses/CheckIn', { state: { value: row } })
          }
        ]
        if (row.userId !== '-1') {
          actions.push({
            title: '业务受理',
            color: 'secondary' as const,
            icon: <House fontSize="small" />,
            onClick: () => message.info('未实现')
          })
        }
        return (
          <Box>
            {actions.map((action, index) => (
              <Tooltip title={action.title} key={index}>
                <IconButton size="small" color={action.color} onClick={action.onClick}>
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )
      }
    }
  ]

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <TableList
        rows={list}
        columns={columns}
        setDialogRoomValue={setDialogRoomValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <DeleteModal
        loading={loading}
        delOpen={delRoomOpen}
        setDelOpen={setDelRoomOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
    </>
  )
}

export default memo(TableData)
