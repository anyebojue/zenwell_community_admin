import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationRecordReply } from 'api/model/property/communitys/roomRenovationRecordModel'
import { RoomRenovationReply } from 'api/model/property/communitys/roomRenovationModel'
import { find } from 'modules/property/communitys/roomRenovationRecord'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'

interface TableDataProps {
  value: RoomRenovationReply
  setDialogValue: Dispatch<SetStateAction<RoomRenovationRecordReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1000': '待审核',
  '2000': '审核不通过',
  '3000': '装修中',
  '4000': '待验收',
  '5000': '验收成功',
  '6000': '验收失败'
}

const TableData: React.FC<TableDataProps> = ({
  value,
  setDialogValue,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RoomRenovationRecordSlice)

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: RoomRenovationRecordReply) => {
      switch (actionType) {
        case 'delete':
          setDelOpen(true)
          setDialogValue(row)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setDialogValue, setSelectedRows]
  )

  const renderActionButtons = (row: RoomRenovationRecordReply) => {
    const actions = [{ title: '删除', action: 'delete' }]
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
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
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'id',
          headerName: '房屋',
          flex: 1,
          renderCell: () => value.roomName
        },
        { field: 'staffName', headerName: '操作人员', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', width: 160 },
        {
          field: 'status',
          headerName: '状态',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.status!] || '未知状态'} />
        },
        {
          field: 'isViolation',
          headerName: '是否违规',
          flex: 1,
          renderCell: ({ row }) => (row.isViolation === 0 ? '正常' : '违规')
        },
        { field: 'remark', headerName: '备注', flex: 1 },
        {
          field: 'img',
          headerName: '图片',
          flex: 1,
          renderCell: ({ row }) => <img style={{ height: '30px' }} src={row.img} alt={row.img} />
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 280,
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
  )
}

export default memo(TableData)
