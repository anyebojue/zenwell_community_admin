import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionTaskDetailReply } from 'api/model/property/spectionTaskDetailModel'
import { find } from 'modules/property/spectionTaskDetail'
import { find as findRepairSetting } from 'modules/property/repairSetting'
import { Button } from '@mui/material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskDetailSlice)

  const columns: Column<SpectionTaskDetailReply>[] = [
    { key: 'taskId', headerName: '任务详情ID', align: 'center' },
    { key: 'inspectionName', headerName: '巡检点名称', align: 'center' },
    {
      key: 'spectionTask.spectionPlan.inspection_plan_name',
      headerName: '巡检计划名称',
      align: 'center'
    },
    {
      key: 'spectionTask.spectionPlan.spectionRoute.name',
      headerName: '巡检路线名称',
      align: 'center',
      renderCell: row => row.spectionTask?.spectionPlan?.spectionRoute?.name
    },
    { key: 'pointStartTime', headerName: '巡检人 开始/结束时间', align: 'center' },
    {
      key: 'pointEndTime',
      headerName: '巡检点 开始/结束时间',
      align: 'center',
      renderCell: row => `${row.pointStartTime} - ${row.pointEndTime}`
    },
    { key: 'inspectionTime', headerName: '实际巡检时间', align: 'center' },
    { key: 'inspectionState', headerName: '实际签到状态', align: 'center' },
    { key: 'spectionTask.actUserName', headerName: '计划巡检人', align: 'center' },
    { key: 'actUserName', headerName: '实际巡检人', align: 'center' },
    { key: 'signType', headerName: '巡检方式', align: 'center' },
    {
      key: 'spectionTask.stateCd',
      headerName: '任务状态',
      align: 'center',
      renderCell: row => row.spectionTask?.stateCd
    },
    { key: 'stateCd', headerName: '巡检点状态', align: 'center' },
    { key: 'patrolType', headerName: '巡检情况', align: 'center' },
    { key: 'img', headerName: '巡检照片', align: 'center' },
    { key: 'createdAt', headerName: '创建时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Button size="small" variant="contained" color="info">
          查看
        </Button>
      )
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  const fetchRepairSettingData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        findRepairSetting({ 'page.num': page.num, 'page.size': page.size })
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
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
    fetchRepairSettingData()
  }, [fetchData, fetchRepairSettingData])

  return <TableList rows={list} columns={columns} />
}

export default memo(TableData)
