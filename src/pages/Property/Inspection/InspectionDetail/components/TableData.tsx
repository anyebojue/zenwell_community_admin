import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionTaskDetailReply } from 'api/model/property/inspection/spectionTaskDetailModel'
import { find } from 'modules/property/inspection/spectionTaskDetail'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskDetailSlice)

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
    fetchData(
      findRepairSetting,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback((actionType: string, row: SpectionTaskDetailReply) => {
    switch (actionType) {
      case 'view':
        console.log(row)
        break
    }
  }, [])

  const renderActionButtons = (row: SpectionTaskDetailReply) =>
    [{ title: '查看', action: 'view' }].map(({ title, action }) => (
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
        { field: 'taskId', headerName: '任务详情ID', flex: 1 },
        { field: 'inspectionName', headerName: '巡检点名称', flex: 1 },
        {
          field: 'spectionTask.spectionPlan.inspection_plan_name',
          headerName: '巡检计划名称',
          flex: 1
        },
        {
          field: 'spectionTask.spectionPlan.spectionRoute.name',
          headerName: '巡检路线名称',
          flex: 1
        },
        { field: 'pointStartTime', headerName: '巡检人 开始/结束时间', flex: 1 },
        { field: 'pointEndTime', headerName: '巡检点 开始/结束时间', flex: 1 },
        { field: 'inspectionTime', headerName: '实际巡检时间', flex: 1 },
        { field: 'inspectionState', headerName: '实际签到状态', flex: 1 },
        { field: 'spectionTask.actUserName', headerName: '计划巡检人', flex: 1 },
        { field: 'actUserName', headerName: '实际巡检人', flex: 1 },
        { field: 'signType', headerName: '巡检方式', flex: 1 },
        { field: 'spectionTask.stateCd', headerName: '任务状态', flex: 1 },
        { field: 'stateCd', headerName: '巡检点状态', flex: 1 },
        { field: 'patrolType', headerName: '巡检情况', flex: 1 },
        { field: 'img', headerName: '巡检照片', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', width: 180 },
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
