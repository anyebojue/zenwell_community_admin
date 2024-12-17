import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesReply } from 'api/model/platform/rolesModel'
import { find } from 'modules/platform/community'
import message from 'components/Message'
import { CommunityReply } from 'api/model/platform/communityModel'
import AccreditModelTableList from './AccreditModelTableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface AccreditTableDataProps {
  dialogValue: RolesReply
  setDialogCommunityValue: Dispatch<SetStateAction<CommunityReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const AccreditModelTableData: React.FC<AccreditTableDataProps> = ({
  setDialogCommunityValue,
  selectedRows,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const columns: Column<CommunityReply>[] = [
    { key: 'id', headerName: '小区ID', align: 'center' },
    { key: 'name', headerName: '小区名称', align: 'center' },
    { key: 'address', headerName: '小区地址', align: 'center' }
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
    <AccreditModelTableList
      rows={list}
      columns={columns}
      setDialogCommunityValue={setDialogCommunityValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AccreditModelTableData)
