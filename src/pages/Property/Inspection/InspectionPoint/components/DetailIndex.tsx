import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/spectionTaskDetail'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { SpectionPointReply } from 'api/model/property/spectionPointModel'

interface PlanIndexProps {
  dialogValue: SpectionPointReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskDetailSlice)

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
      disableRowSelectionOnClick
      disableColumnMenu
      rows={list}
      columns={[
        {
          field: 'inspectionName',
          headerName: '巡检点名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'spectionTask.spectionPlan.inspection_plan_name',
          headerName: '巡检计划名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => params.row.spectionTask?.spectionPlan?.inspectionPlanName
        },
        {
          field: 'spectionTask.spectionPlan.spectionRoute.name',
          headerName: '巡检路线名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => params.row.spectionTask?.spectionPlan?.spectionRoute?.name
        },
        {
          field: 'pointStartTime',
          headerName: '巡检人 开始/结束时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'pointEndTime',
          headerName: '巡检点 开始/结束时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => `${params.row.pointStartTime} - ${params.row.pointEndTime}`
        },
        {
          field: 'inspectionTime',
          headerName: '实际巡检时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'inspectionState',
          headerName: '实际签到状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'spectionTask.actUserName',
          headerName: '计划巡检人',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => params.row.spectionTask?.actUserName
        },
        {
          field: 'actUserName',
          headerName: '实际巡检人',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'signType',
          headerName: '巡检方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => params.row.spectionTask?.signType
        },
        {
          field: 'spectionTask.stateCd',
          headerName: '任务状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap',
          renderCell: params => params.row.spectionTask?.stateCd
        },
        {
          field: 'stateCd',
          headerName: '巡检点状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'patrolType',
          headerName: '巡检情况',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'img',
          headerName: '巡检照片',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header-wrap'
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
