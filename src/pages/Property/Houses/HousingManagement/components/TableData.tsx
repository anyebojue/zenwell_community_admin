import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FloorReply } from 'api/model/property/houses/floorModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { deleteByIds, find } from 'modules/property/houses/room'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import DeleteModal from 'components/DeleteModal'

interface TableDataProps {
  dialogValue: FloorReply
  dialogRoomValue: RoomReply | undefined
  setDialogRoomValue: Dispatch<SetStateAction<RoomReply | undefined>>
  setOpenRoomDialog: Dispatch<SetStateAction<boolean>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  delRoomOpen: boolean
  setDelRoomOpen: Dispatch<SetStateAction<boolean>>
}

const statusType: Record<string, string> = {
  '110': '住宅',
  '120': '办公室',
  '119': '宿舍',
  '128': '储物间'
}

const statusValue: Record<string, string> = {
  '2001': '已入住',
  '2002': '未销售',
  '2003': '已交房',
  '2004': '未入住',
  '2005': '已装修',
  '2006': '已出租',
  '2007': '已出售',
  '2008': '空闲',
  '2009': '装修中'
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: RoomReply) => {
      switch (actionType) {
        case 'edit':
          setDialogRoomValue(row)
          setOpenRoomDialog(true)
          break
        case 'delete':
          setDelRoomOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'checkIn':
          navigate('/houses/CheckIn', { state: { value: row } })
          break
        case 'checkOut':
          navigate('/houses/CheckOut', { state: { value: row } })
          break
        case 'business':
          message.info('未实现')
          break
      }
    },
    [navigate, setDelRoomOpen, setDialogRoomValue, setOpenRoomDialog, setSelectedRows]
  )

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

  const renderActionButtons = (row: RoomReply) => {
    const baseActions = [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    let conditionalActions: { title: string; action: string }[] = []
    if (row.userId === '' || row.userId === '-1') {
      conditionalActions = [{ title: '交房', action: 'checkIn' }]
    } else {
      conditionalActions = [
        { title: '退房', action: 'checkOut' },
        { title: '业务受理', action: 'business' }
      ]
    }
    const actions = [...baseActions, ...conditionalActions]
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: '-5px',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))
  }

  return (
    <>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2'
          }
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          { field: 'roomNum', headerName: '房屋', flex: 1 },
          { field: 'layer', headerName: '楼层', flex: 1 },
          {
            field: 'owner',
            headerName: '业主',
            flex: 1,
            renderCell: ({ row }) => (row.owner ? `${row.owner.name}(${row.owner.link})` : '-')
          },
          {
            field: 'roomSubType',
            headerName: '类型',
            flex: 1,
            renderCell: ({ row }) => <Chip label={statusType[row.roomSubType!] || '其它'} />
          },
          { field: 'builtUpArea', headerName: '建筑/室内面积', flex: 1 },
          { field: 'roomRent', headerName: '租金', flex: 1 },
          {
            field: 'state',
            headerName: '房屋状态',
            flex: 1,
            renderCell: ({ row }) => <Chip label={statusValue[row.state!] || '未知'} />
          },
          { field: 'createdAt', headerName: '入住时间', width: 180 },
          { field: 'memberCount', headerName: '业主成员', flex: 1 },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 250,
            getActions: ({ row }) => renderActionButtons(row),
            headerAlign: 'center',
            align: 'center'
          }
        ]}
        onRowSelectionModelChange={handleRowSelection}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationMode="server"
        rowCount={Number(page.total)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: Number(page.size)
            }
          }
        }}
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
