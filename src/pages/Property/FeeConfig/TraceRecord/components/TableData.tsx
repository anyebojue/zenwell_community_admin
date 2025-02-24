import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountRecordReply } from 'api/model/property/feeConfig/applyRoomDiscountRecordModel'
import { find } from 'modules/property/feeConfig/applyRoomDiscountRecord'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { ApplyRoomDiscountReply } from 'api/model/property/feeConfig/applyRoomDiscountModel'

const statusValue: Record<string, string> = {
  '1': '申请验房',
  '2': '验房通过',
  '3': '验房不通过',
  '4': '审批通过',
  '5': '审批不通过'
}

interface TableDataProps {
  value: ApplyRoomDiscountReply
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ value, setSelectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ApplyRoomDiscountRecordSlice)

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
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, ardId: value.id! },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, value])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: ApplyRoomDiscountRecordReply) => {
      switch (actionType) {
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ApplyRoomDiscountRecordReply) =>
    [{ title: '删除', action: 'delete' }].map(({ title, action }) => (
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
          field: 'roomId',
          headerName: '房屋',
          flex: 1,
          renderCell: () => `${value.roomId}`
        },
        { field: 'createUserName', headerName: '操作人员', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', flex: 1 },
        {
          field: 'stateCd',
          headerName: '状态',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知状态'} />
        },
        {
          field: 'isTrue',
          headerName: '是否违规',
          flex: 1,
          renderCell: ({ row }) => (row.isTrue ? '是' : '否')
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
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
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
