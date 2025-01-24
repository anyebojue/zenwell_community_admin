import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/spectionPlan'
import message from 'components/Message'
import { DataGrid } from '@mui/x-data-grid'
import { SpectionTaskReply } from 'api/model/property/spectionTaskModel'

interface PlanIndexProps {
  dialogValue: SpectionTaskReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionPlanSlice)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          inspectionTaskId: dialogValue.id
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
          field: 'inspectionPlanName',
          headerName: '计划名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'spectionRoute',
          headerName: '计划路线',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.spectionRoute?.name
        },
        {
          field: 'inspectionPlanPeriod',
          headerName: '计划周期',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.inspectionPlanPeriod === 1 ? '月/日' : row.inspectionPlanPeriod === 2 ? '按周' : ''
        },
        {
          field: 'signType',
          headerName: '签到方式',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) =>
            row.status === 0 ? '现场定位' : row.status === 1 ? '现场拍照(默认定位)' : ''
        },
        {
          field: 'startDate',
          headerName: '日期范围',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.startDate} - ${row.endDate}`
        },
        {
          field: 'startTime',
          headerName: '时间范围',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => `${row.startTime} - ${row.endTime}`
        },
        {
          field: 'beforeTime',
          headerName: '任务提前(分钟)',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'communityId',
          headerName: '制定人',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createdAt',
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
          align: 'center',
          renderCell: ({ row }) => (row.status === 0 ? '禁用' : row.status === 1 ? '启用' : '')
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
