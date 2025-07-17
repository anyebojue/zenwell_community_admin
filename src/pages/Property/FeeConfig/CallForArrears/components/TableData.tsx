import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeCollectionOrderReply } from 'api/model/property/feeConfig/feeCollectionOrderModel'
import { find } from 'modules/property/feeConfig/feeCollectionOrder'
import { find as findMeterType } from 'modules/property/feeConfig/meterType'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'

interface TableDataProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
  setDialogMeterWaterValue: Dispatch<SetStateAction<FeeCollectionOrderReply>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogMeterWaterValue,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeCollectionOrderSlice)

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
    fetchData(findMeterType, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: FeeCollectionOrderReply) => {
      switch (actionType) {
        case 'delete':
          setDialogMeterWaterValue(row)
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setDialogMeterWaterValue, setSelectedRows]
  )

  const renderActionButtons = (row: FeeCollectionOrderReply) =>
    [{ title: '删除', action: 'delete' }].map(({ title, action }) => (
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
        { field: 'feeCollectionDetail.OwnerName', headerName: '业主名称', flex: 1 },
        { field: 'feeCollectionDetail.PayerObjName', headerName: '付费对象', flex: 1 },
        { field: 'feeCollectionDetail.FeeName', headerName: '费用名称', flex: 1 },
        { field: 'feeCollectionDetail.OweAmount', headerName: '催缴金额', flex: 1 },
        { field: 'feeCollectionDetail.createdAt', headerName: '欠费时间段', flex: 1 },
        { field: 'feeCollectionDetail.CollectionWay', headerName: '催缴方式', flex: 1 },
        { field: 'StaffName', headerName: '催缴人', flex: 1 },
        { field: 'feeCollectionDetail.StateCd', headerName: '状态', flex: 1 },
        { field: 'feeCollectionDetail.remark', headerName: '说明', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', flex: 1 },
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
