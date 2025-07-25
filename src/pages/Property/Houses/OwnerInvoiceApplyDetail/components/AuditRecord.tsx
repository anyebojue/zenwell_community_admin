import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/ownerInvoiceApplyItem'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'

interface PlanIndexProps {
  dialogValue: OwnerInvoiceApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplyItemSlice)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          applyId: dialogValue.id
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
      disableRowSelectionOnClick
      disableColumnMenu
      rows={list}
      columns={[
        {
          field: 'itemType',
          headerName: '类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.itemType === '1001' ? '账户预存' : row.itemType === '2002' ? '物业缴费' : ''
        },
        {
          field: 'itemName',
          headerName: '名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'itemAmount',
          headerName: '金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'payTime',
          headerName: '缴费时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'remark',
          headerName: '备注',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'id',
          headerName: '缴费ID',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        }
      ]}
      pageSizeOptions={[20]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 20
          }
        }
      }}
    />
  )
}

export default memo(PlanIndex)
