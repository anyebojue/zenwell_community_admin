import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeCollectionOrderReply } from 'api/model/property/feeConfig/feeCollectionOrderModel'
import { find } from 'modules/property/feeConfig/feeCollectionOrder'
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

const statusCd: Record<string, string> = {
  T: '当前账单',
  F: '往期账单'
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
        { field: 'id', headerName: '账单编号', width: 200, headerAlign: 'center', align: 'center' },
        {
          field: 'payerObjName',
          headerName: '收费项目',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeCollectionDetail?.payerObjName
        },
        { field: 'name', headerName: '账单名称', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'cumulativeAmount',
          headerName: '累计应收',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeCollectionDetail?.cumulativeAmount
        },
        {
          field: 'oweAmount',
          headerName: '当期应收',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeCollectionDetail?.oweAmount
        },
        {
          field: 'actualAmount',
          headerName: '实收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeCollectionDetail?.actualAmount
        },
        {
          field: 'createdAt',
          headerName: '账单日期',
          width: 180,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'statusCd',
          headerName: '账单类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusCd[row.statusCd!] || '-'} />
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
