import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerReply } from 'api/model/property/ownerModel'
import { find } from 'modules/property/owner'
import message from 'components/Message'
import { Button } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import AssociatedTableList from './AssociatedTableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface AssociatedTableDataProps {
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOwnerUser: Dispatch<SetStateAction<OwnerReply | undefined>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  selectedRows,
  setSelectedRows,
  setOwnerUser,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)

  const columns: Column<OwnerReply>[] = [
    { key: 'name', headerName: '名称', align: 'center' },
    { key: 'sex', headerName: '性别', align: 'center' },
    { key: 'idCard', headerName: '身份证', align: 'center' },
    { key: 'link', headerName: '联系方式', align: 'center' },
    { key: 'userId', headerName: '创建员工', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
          onClick={() => {
            setOwnerUser(row)
            setAssociatedOpen(false)
          }}
        >
          选择
        </Button>
      )
    }
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
    <AssociatedTableList
      rows={list}
      columns={columns}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AssociatedTableData)
