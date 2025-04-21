import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/feeConfig/feeConfigLog'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'

interface PlanIndexProps {
  dialogValue: OwnerInvoiceApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeConfigLogSlice)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          feeConfigId: dialogValue.id
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
  }, [dispatch, page.num, page.size, dialogValue.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        {
          field: 'fee_type_cd',
          headerName: '费用类型',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').fee_type_cd
        },
        {
          field: 'name',
          headerName: '收费项目',
          flex: 1,
          renderCell: ({ row }) => JSON.parse(row.afterContent || row.beforeContent || '{}').name
        },
        {
          field: 'fee_flag',
          headerName: '费用标识',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').fee_flag
        },
        {
          field: 'bill_type',
          headerName: '催缴类型',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').bill_type
        },
        {
          field: 'paymentCd',
          headerName: '付费类型',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').payment_cd
        },
        {
          field: 'payment_cycle',
          headerName: '缴费周期(单位:月)',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').payment_cycle
        },
        {
          field: 'square_price',
          headerName: '计费单价(单位:元)',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').square_price
        },
        {
          field: 'additional_amount',
          headerName: '附加/固定费用(单位:元)',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').additional_amount
        },
        {
          field: 'deduct_from',
          headerName: '账户抵扣',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').deduct_from
        },
        {
          field: 'pay_online',
          headerName: '手机缴费',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').pay_online
        },
        {
          field: 'scale',
          headerName: '进位方式',
          flex: 1,
          renderCell: ({ row }) => JSON.parse(row.afterContent || row.beforeContent || '{}').scale
        },
        {
          field: 'decimalPlace',
          headerName: '保留小数',
          flex: 1,
          renderCell: ({ row }) =>
            JSON.parse(row.afterContent || row.beforeContent || '{}').decimal_place
        },
        { field: 'action', headerName: '动作', flex: 1 },
        { field: 'createUser', headerName: '操作人', flex: 1 },
        { field: 'createdAt', headerName: '操作时间', flex: 1 }
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

export default memo(PlanIndex)
