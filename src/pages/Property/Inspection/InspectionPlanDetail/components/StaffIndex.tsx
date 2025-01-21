import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/staff'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { SpectionPlanReply } from 'api/model/property/spectionPlanModel'

interface StaffIndexProps {
  dialogValue: SpectionPlanReply
}

const StaffIndex: React.FC<StaffIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.StaffSlice)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          inspectionPlanId: dialogValue.id
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
          field: 'staffName',
          headerName: '巡检人员',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'startTime',
          headerName: '开始时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'endTime',
          headerName: '结束时间',
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

export default memo(StaffIndex)
