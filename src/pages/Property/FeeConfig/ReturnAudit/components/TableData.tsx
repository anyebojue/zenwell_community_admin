import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReturnPayFeeReply } from 'api/model/property/feeConfig/returnPayFeeModel'
import { find } from 'modules/property/feeConfig/returnPayFee'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ReturnPayFeeReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1001': '待审核',
  '2002': '审核通过',
  '3003': '审核不通过'
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ReturnPayFeeSlice)

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
    (actionType: string, row: ReturnPayFeeReply) => {
      switch (actionType) {
        case 'audit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'details':
          navigate('/FeeConfig/RefundDetails', { state: { value: row } })
          setDialogValue(row)
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog]
  )

  const renderActionButtons = (row: ReturnPayFeeReply) => {
    const actionButtons = [
      { title: '审核', action: 'audit', condition: row.stateCd === '1001' },
      { title: '详情', action: 'details', condition: true }
    ]
    return actionButtons
      .filter(button => button.condition)
      .map(({ title, action }) => (
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
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        },
        mt: 1
      }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        {
          field: 'payFeeDetail.payFee.feeConfig.feeConfigType.name',
          headerName: '费用类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.payFeeDetail?.payFee?.feeConfig?.feeConfigType?.name
        },
        {
          field: 'payFeeDetail.payFee.payerObjName',
          headerName: '付费对象',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.payFeeDetail?.payFee?.payerObjName
        },
        {
          field: 'cycles',
          headerName: '付费周期(单位:月)',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'receivableAmount',
          headerName: '应付金额/实付金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.receivableAmount} / ${row.receivedAmount}`
        },
        {
          field: 'createdAt',
          headerName: '申请时间',
          headerAlign: 'center',
          align: 'center',
          width: 180
        },
        {
          field: 'reason',
          headerName: '退费原因',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'applyPersonName',
          headerName: '申请人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'stateCd',
          headerName: '审核状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知类型'} />
        },
        {
          field: 'auditPersonName',
          headerName: '审核人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'statusCd',
          headerName: '	退款情况',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
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
