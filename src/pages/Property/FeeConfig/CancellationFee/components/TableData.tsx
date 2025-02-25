import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountTypeReply } from 'api/model/property/feeConfig/applyRoomDiscountTypeModel'
import { find } from 'modules/property/feeConfig/applyRoomDiscountType'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ApplyRoomDiscountTypeReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
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

  const handleActionClick = useCallback(
    (actionType: string, row: ApplyRoomDiscountTypeReply) => {
      switch (actionType) {
        case 'delete':
          setOpenDialog(true)
          setDialogValue(row)
          break
      }
    },
    [setDialogValue, setOpenDialog]
  )

  const renderActionButtons = (row: ApplyRoomDiscountTypeReply) =>
    [{ title: '取消申请', action: 'delete' }].map(({ title, action }) => (
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
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: '', headerName: '批次号', flex: 1 },
        { field: '', headerName: '员工', flex: 1 },
        { field: '', headerName: '时间', flex: 1 },
        { field: '', headerName: '取消原因', flex: 1 },
        { field: '', headerName: '审核状态', flex: 1 },
        { field: '', headerName: '审核意见', flex: 1 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
        }
      ]}
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
