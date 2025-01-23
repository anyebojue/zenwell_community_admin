import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceReply } from 'api/model/property/ownerInvoiceModel'
import { find } from 'modules/property/ownerInvoice'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

const renderActionButtons = (
  setDialogType: Dispatch<SetStateAction<string>>,
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
  setDelOpen: Dispatch<SetStateAction<boolean>>
) => (
  <Box>
    {[
      {
        title: '修改',
        color: 'secondary' as const,
        icon: <Edit fontSize="small" />,
        onClick: () => {
          setOpenDialog(true)
          setDialogType('edit')
        }
      },
      {
        title: '删除',
        color: 'error' as const,
        icon: <Delete fontSize="small" />,
        onClick: () => setDelOpen(true)
      }
    ].map((action, index) => (
      <Tooltip title={action.title} key={index}>
        <IconButton size="small" color={action.color} onClick={action.onClick}>
          {action.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Box>
)

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<OwnerInvoiceReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceSlice)

  const columns: Column<OwnerInvoiceReply>[] = [
    { key: 'id', headerName: '编号', align: 'center' },
    { key: 'ownerName', headerName: '业主名称', align: 'center' },
    {
      key: 'invoiceType',
      headerName: '发票类型',
      align: 'center',
      renderCell: row => (row.invoiceType === '1001' ? '个人' : '企业')
    },
    { key: 'invoiceName', headerName: '发票名头', align: 'center' },
    { key: 'invoiceNum', headerName: '纳税人识别号', align: 'center' },
    { key: 'invoiceAddress', headerName: '地址电话', align: 'center' },
    { key: 'createdAt', headerName: '开户行及账号', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => renderActionButtons(setDialogType, setOpenDialog, setDelOpen)
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
