import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/ownerInvoiceApplyEvent'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'

interface PlanIndexProps {
  dialogValue: OwnerInvoiceApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplyEventSlice)

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
          field: 'eventType',
          headerName: '类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.eventType === '1001'
              ? '审核成功'
              : row.eventType === '2002'
                ? '上传'
                : row.eventType === '3003'
                  ? '审核失败'
                  : row.eventType === '4004'
                    ? '领用'
                    : row.eventType === '5005'
                      ? '登记'
                      : ''
        },
        {
          field: 'createUserName',
          headerName: '操作人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'remark',
          headerName: '说明',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createdAt',
          headerName: '时间',
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
