import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { find } from 'modules/property/houses/spaceConfirmOrder'
import { SpaceConfirmOrderReply } from 'api/model/property/houses/spaceConfirmOrderModel'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: SpaceConfirmOrderReply | undefined
  setDialogValue: Dispatch<SetStateAction<SpaceConfirmOrderReply | undefined>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpaceConfirmOrderSlice)

  const columns: Column<SpaceConfirmOrderReply>[] = [
    { key: 'id', headerName: '核销订单', align: 'center' },
    {
      key: 'spacePerson',
      headerName: '场馆',
      align: 'center',
      renderCell: row => row.spacePerson?.space?.venue?.name
    },
    {
      key: 'spaceId',
      headerName: '场地',
      align: 'center',
      renderCell: row => row.spacePerson?.space?.name
    },
    {
      key: 'spacePerson.appointmentTime',
      headerName: '预约日期',
      align: 'center',
      renderCell: row => row.spacePerson?.appointmentTime
    },
    {
      key: 'spacePerson.hours',
      headerName: '预约时间',
      align: 'center',
      renderCell: row => row.spacePerson?.hours
    },
    {
      key: 'spacePerson.personName',
      headerName: '预约人',
      align: 'center',
      renderCell: row => row.spacePerson?.personName
    },
    {
      key: 'spacePerson.personTel',
      headerName: '预约电话',
      align: 'center',
      renderCell: row => row.spacePerson?.personTel
    },
    {
      key: 'spacePerson.appointmentTime',
      headerName: '核销时间',
      align: 'center',
      renderCell: row => row.spacePerson?.appointmentTime
    },
    { key: 'remark', headerName: '备注', align: 'center' }
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

  return <TableList rows={list} columns={columns} setDialogValue={setDialogValue} />
}

export default memo(TableData)
