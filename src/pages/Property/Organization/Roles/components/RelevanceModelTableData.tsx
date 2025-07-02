import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply } from 'api/model/platform/organization/organizationInfoModel'
import { EmployeesReply } from 'api/model/platform/organization/employeesModel'
import { find } from 'modules/platform/organization/employees'
import message from 'components/Message'
import RelevanceModelTableList from './RelevanceModelTableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface AssociatedTableDataProps {
  dialogValue: OrganizationInfoReply
  setDialogEmployessValue: Dispatch<SetStateAction<EmployeesReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  setDialogEmployessValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.EmployeesSlice)

  const columns: Column<EmployeesReply>[] = [
    { key: 'id', headerName: '员工编号', align: 'center' },
    { key: 'username', headerName: '员工名称', align: 'center' },
    { key: 'address', headerName: '员工地址', align: 'center' }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size
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
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <RelevanceModelTableList
      rows={list}
      columns={columns}
      setDialogEmployessValue={setDialogEmployessValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AssociatedTableData)
