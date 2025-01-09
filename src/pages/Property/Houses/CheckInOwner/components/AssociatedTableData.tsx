import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import { find } from 'modules/property/housingManagement'
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
  setSelectValue: Dispatch<SetStateAction<HousingManagementReply | undefined>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  selectedRows,
  setSelectedRows,
  setSelectValue,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.HousingManagementSlice)

  const columns: Column<HousingManagementReply>[] = [
    { key: 'id', headerName: '楼栋ID', align: 'center' },
    { key: 'name', headerName: '楼栋名称', align: 'center' },
    { key: 'name', headerName: '楼栋编号', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
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
            setSelectValue(row)
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
    <AssociatedTableList
      rows={list}
      columns={columns}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(AssociatedTableData)
