import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { find } from 'modules/property/parking/ownerCar'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerCarReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerCarSlice)

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
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { leaseType: selectedButton })
      },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerCarReply) => {
      switch (actionType) {
        case 'discount':
          break
        case 'details':
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: OwnerCarReply) =>
    [
      { title: '续租', action: 'discount' },
      { title: '买月卡', action: 'details' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
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

  return (
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
        { field: 'carNum', headerName: '车牌号', flex: 1 },
        { field: 'member_ids', headerName: '成员车辆', flex: 1 },
        { field: 'roomName', headerName: '房屋号', flex: 1 },
        { field: 'leaseType', headerName: '车牌类型', flex: 1 },
        { field: 'carType', headerName: '车辆类型', flex: 1 },
        { field: 'carColor', headerName: '颜色', flex: 1 },
        { field: 'ownerName', headerName: '业主', flex: 1 },
        { field: 'parkingSpace.name', headerName: '车位', flex: 1 },
        { field: 'startTime', headerName: '有效期', flex: 1 },
        { field: 'stateCd', headerName: '状态', flex: 1 },
        { field: 'remark', headerName: '备注', flex: 1 },
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
