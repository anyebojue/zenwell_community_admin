import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
import { find } from 'modules/property/repairPool'
import { find as findRepairSetting } from 'modules/property/repairSetting'
import { Button } from '@mui/material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)

  const columns: Column<RepairPoolReply>[] = [
    { key: 'repairObjName', headerName: '任务详情ID', align: 'center' },
    { key: 'repairObjName', headerName: '巡检点名称', align: 'center' },
    { key: 'repairObjName', headerName: '巡检计划名称	', align: 'center' },
    { key: 'repairObjName', headerName: '巡检路线名称	', align: 'center' },
    { key: 'repairObjName', headerName: '巡检人 开始/结束时间', align: 'center' },
    { key: 'repairObjName', headerName: '巡检点 开始/结束时间', align: 'center' },
    { key: 'repairObjName', headerName: '实际巡检时间', align: 'center' },
    { key: 'repairObjName', headerName: '实际签到状态', align: 'center' },
    { key: 'repairObjName', headerName: '计划巡检人', align: 'center' },
    { key: 'repairObjName', headerName: '实际巡检人', align: 'center' },
    { key: 'repairObjName', headerName: '巡检方式', align: 'center' },
    { key: 'repairObjName', headerName: '任务状态', align: 'center' },
    { key: 'repairObjName', headerName: '巡检点状态', align: 'center' },
    { key: 'repairObjName', headerName: '巡检情况', align: 'center' },
    { key: 'repairObjName', headerName: '巡检照片', align: 'center' },
    { key: 'repairObjName', headerName: '创建时间', align: 'center' },
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
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, statusCd: 1000 })
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
