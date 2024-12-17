import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply } from 'api/model/platform/organizationInfoModel'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import { find } from 'modules/platform/employees'
import message from 'components/Message'
import AssociatedTableList from './AssociatedTableList'

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
    { key: 'username', headerName: '员工名称', align: 'center' },
    { key: 'mobile', headerName: '员工电话', align: 'center' },
    { key: 'id', headerName: '员工编号', align: 'center' }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size
        })
      )
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <AssociatedTableList
      rows={list}
      columns={columns}
      setDialogEmployessValue={setDialogEmployessValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AssociatedTableData)
