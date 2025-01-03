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
import { RoomReply } from 'api/model/property/roomModel'
import { deleteByIds, find } from 'modules/property/room'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Article, Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import DeleteModal from 'components/DeleteModal'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
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
  dialogValue: HousingManagementReply
  dialogRoomValue: RoomReply
  setDialogRoomValue: Dispatch<SetStateAction<RoomReply>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogRoomValue,
  setDialogRoomValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RoomSlice)
  const [delOpen, setDelOpen] = useState(false)
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
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
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

  const columns: Column<RoomReply>[] = [
    {
      key: 'roomNum',
      headerName: '房屋',
      align: 'center',
      renderCell: row => `--${row.roomNum}`
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
      align: 'center'
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
      align: 'center'
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
      renderCell: () => renderActionButtons({ setDelOpen })
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
        setDialogUserValue={setDialogRoomValue}
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
