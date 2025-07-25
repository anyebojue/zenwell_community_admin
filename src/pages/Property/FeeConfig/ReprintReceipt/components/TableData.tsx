import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeReceiptReply } from 'api/model/property/feeConfig/feeReceiptModel'
import { find } from 'modules/property/feeConfig/feeReceipt'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.FeeReceiptSlice)

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
    (actionType: string, row: FeeReceiptReply) => {
      switch (actionType) {
        case 'receipt':
          navigate('/feeConfig/ReceiptReprint', { state: { value: row } })
          break
        case 'ticket':
          navigate('/feeConfig/MakeUpTheReceipt', { state: { value: row } })
          break
      }
    },
    [navigate]
  )

  const renderActionButtons = (row: FeeReceiptReply) =>
    [
      { title: '补打收据', action: 'receipt' },
      { title: '补打小票', action: 'ticket' }
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
      rows={list}
      columns={[
        { field: 'id', headerName: '收据编号', width: 200, headerAlign: 'center', align: 'center' },
        {
          field: 'feeReceiptDetail.payFee.feeConfig.feeConfigType.name',
          headerName: '费用类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeReceiptDetail?.payFee?.feeConfig?.feeConfigType?.name
        },
        {
          field: 'feeReceiptDetail.payFee.feeConfig.feeName',
          headerName: '费用项',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeReceiptDetail?.payFee?.feeConfig?.feeName
        },
        {
          field: 'feeReceiptDetail.payFee.payerObjName',
          headerName: '房屋/车位',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.feeReceiptDetail?.payFee?.payerObjType === '3333'
              ? row.feeReceiptDetail?.payFee?.payerObjName
              : row.feeReceiptDetail?.payFee?.incomeObjName
        },
        {
          field: 'feeReceiptDetail.payFee.incomeObjName',
          headerName: '业主',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeReceiptDetail?.payFee?.incomeObjName
        },
        {
          field: 'feeReceiptDetail.payFee.payFeeDetail.receivedAmount',
          headerName: '总金额(单位:元)',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeReceiptDetail?.payFee?.payFeeDetail?.receivedAmount
        },
        {
          field: 'feeReceiptDetail.payFee.payFeeDetail.createdAt',
          headerName: '缴费时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeReceiptDetail?.payFee?.payFeeDetail?.createdAt
        },
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
