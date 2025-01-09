import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
import { find } from 'modules/property/repairPool'
import { find as findRepairSetting } from 'modules/property/repairSetting'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<RepairPoolReply | undefined>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)

  const columns: Column<RepairPoolReply>[] = [
    { key: 'id', headerName: '工单编号', align: 'center' },
    { key: 'communityId', headerName: '位置', align: 'center' },
    {
      key: 'repairSetting',
      headerName: '报修类型',
      align: 'center',
      renderCell: row => row.repairSetting?.repairTypeName
    },
    { key: 'repairName', headerName: '报修人', align: 'center' },
    { key: 'tel', headerName: '联系方式', align: 'center' },
    { key: 'appointmentTime', headerName: '预约时间', align: 'center' },
    { key: 'createdAt', headerName: '提交时间', align: 'center' },
    {
      key: 'statusCd',
      headerName: '状态',
      align: 'center',
      renderCell: row =>
        row.statusCd === 1000
          ? '未派单'
          : row.statusCd === 1100
            ? '接单'
            : row.statusCd === 1200
              ? '退单'
              : row.statusCd === 1300
                ? '转单'
                : row.statusCd === 1400
                  ? '申请支付'
                  : row.statusCd === 1500
                    ? '支付失败'
                    : row.statusCd === 1700
                      ? '待评价'
                      : row.statusCd === 1800
                        ? '电话回访'
                        : row.statusCd === 1900
                          ? '办理完成'
                          : row.statusCd === 2000
                            ? '未办理结单'
                            : row.statusCd === 2001
                              ? '暂停'
                              : ''
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

  return <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
}

export default memo(TableData)
