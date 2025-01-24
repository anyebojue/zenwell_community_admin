import { memo, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationRecordReply } from 'api/model/property/roomRenovationRecordModel'
import { find } from 'modules/property/roomRenovationRecord'
import message from 'components/Message'
import { RoomRenovationReply } from 'api/model/property/roomRenovationModel'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  value: RoomRenovationReply
}

const TableData: React.FC<TableDataProps> = ({ value }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RoomRenovationRecordSlice)

  const columns: Column<RoomRenovationRecordReply>[] = [
    { key: 'rId', headerName: '明细ID', align: 'center' },
    { key: 'id', headerName: '验房人', align: 'center', renderCell: () => value.roomName },
    { key: 'staffName', headerName: '验房时间', align: 'center' },
    {
      key: 'status',
      headerName: '状态',
      align: 'center',
      renderCell: () => '待审核(原始图片)'
    },
    { key: 'remark', headerName: '说明', align: 'center' }
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

  return <TableList rows={list} columns={columns} />
}

export default memo(TableData)
