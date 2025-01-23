import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceApplyReply } from 'api/model/property/ownerInvoiceApplyModel'
import { find } from 'modules/property/ownerInvoiceApply'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit, FileCopy } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerInvoiceApplyReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplySlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  const columns: Column<OwnerInvoiceApplyReply>[] = [
    { key: 'id', headerName: '编号', align: 'center' },
    { key: 'invoiceType', headerName: '发票类型', align: 'center' },
    { key: 'ownerName', headerName: '业主名称', align: 'center' },
    { key: 'createUserName', headerName: '申请人', align: 'center' },
    { key: 'ownerInvoice.invoiceName', headerName: '发票名头', align: 'center' },
    { key: 'ownerInvoice.invoiceNum', headerName: '纳税人识别号', align: 'center' },
    { key: 'ownerInvoice.invoiceAddress', headerName: '地址', align: 'center' },
    { key: 'ownerInvoice.invoiceLink', headerName: '电话', align: 'center' },
    { key: 'invoiceAmount', headerName: '申请金额', align: 'center' },
    { key: 'invoiceCode', headerName: '发票号', align: 'center' },
    {
      key: 'stateCd',
      headerName: '审核状态',
      align: 'center',
      renderCell: () => community.name
    },
    { key: 'createdAt', headerName: '申请时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '重新上传',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => message.info('未实现')
            },
            {
              title: '登记',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => message.info('未实现')
            },
            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            },
            {
              title: '详情',
              color: 'primary' as const,
              icon: <FileCopy fontSize="small" />,
              onClick: () => message.info('未实现')
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
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, stateCd: selectedButton })
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
  }, [dispatch, page.num, page.size, selectedButton])

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
