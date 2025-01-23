import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceReply } from 'api/model/property/ownerInvoiceModel'
import { find } from 'modules/property/ownerInvoice'
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
  setOwnerInvoice: Dispatch<SetStateAction<OwnerInvoiceReply | undefined>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  selectedRows,
  setSelectedRows,
  setOwnerInvoice,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceSlice)

  const columns: Column<OwnerInvoiceReply>[] = [
    { key: 'ownerName', headerName: '业主名称', align: 'center' },
    { key: 'invoiceType', headerName: '发票类型', align: 'center' },
    { key: 'invoiceName', headerName: '发票名头', align: 'center' },
    { key: 'invoiceNum', headerName: '纳税人识别号', align: 'center' },
    { key: 'invoiceAddress', headerName: '地址', align: 'center' },
    { key: 'invoiceLink', headerName: '电话', align: 'center' },
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
            setOwnerInvoice(row)
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
