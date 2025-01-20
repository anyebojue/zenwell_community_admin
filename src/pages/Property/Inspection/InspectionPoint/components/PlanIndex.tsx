import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/spectionPlan'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { SpectionPointReply } from 'api/model/property/spectionPointModel'

interface PlanIndexProps {
  dialogValue: SpectionPointReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionPlanSlice)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, inspectionPointId: dialogValue.id })
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
  }, [dialogValue.id, dispatch, page.num, page.size])

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
          field: 'inspectionPlanName',
          headerName: '计划名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'inspectionRouteId',
          headerName: '计划路线',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'inspectionPlanPeriod',
          headerName: '计划周期',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'signType',
          headerName: '签到方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'inspectionMonth',
          headerName: '日期范围',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'inspectionDay',
          headerName: '时间范围',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'beforeTime',
          headerName: '任务提前(分钟)',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createUserName',
          headerName: '制定人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'startTime',
          headerName: '制定时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createUserName',
          headerName: '巡检人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'status',
          headerName: '状态',
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
