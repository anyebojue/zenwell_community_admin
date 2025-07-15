import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountTypeReply } from 'api/model/property/feeConfig/applyRoomDiscountTypeModel'
import { find } from 'modules/property/feeConfig/applyRoomDiscountType'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<ApplyRoomDiscountTypeReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ApplyRoomDiscountTypeSlice)

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
    (actionType: string, row: ApplyRoomDiscountTypeReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ApplyRoomDiscountTypeReply) =>
    [
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
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'name', headerName: '类型名称', flex: 1 },
        { field: 'remark', headerName: '类型描述', flex: 1 },
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
