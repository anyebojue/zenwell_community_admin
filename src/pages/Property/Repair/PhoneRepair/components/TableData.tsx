import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingReply } from 'api/model/property/repairSettingModel'
import { find } from 'modules/property/repairSetting'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<RepairSettingReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, selectedRows, setSelectedRows }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)

  const columns: Column<RepairSettingReply>[] = [
    { key: 'repairTypeName', headerName: '工单编号', align: 'center' },
    { key: 'repairTypeName', headerName: '位置', align: 'center' },
    { key: 'repairTypeName', headerName: '报修类型', align: 'center' },
    { key: 'repairTypeName', headerName: '报修人', align: 'center' },
    { key: 'repairTypeName', headerName: '联系方式', align: 'center' },
    { key: 'repairTypeName', headerName: '预约时间', align: 'center' },
    { key: 'repairTypeName', headerName: '提交时间', align: 'center' },
    { key: 'repairTypeName', headerName: '状态', align: 'center' }
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <TableList
      rows={list}
      columns={columns}
      setDialogValue={setDialogValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(TableData)
