import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceApplyReply } from 'api/model/property/ownerInvoiceApplyModel'
import { find } from 'modules/property/ownerInvoiceApply'
import { Box, Tooltip, IconButton } from '@mui/material'
import { CheckCircle, Delete, Edit, FileCopy, Upload } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'
import Audit from './Audit'
import UploadInvoice from './UploadInvoice'
import Verify from './Verify'

export interface Column<T> {
  headerName: string
  key: Exclude<keyof T, symbol> | `${Exclude<keyof T, symbol>}.${string}` | 'operate' // 过滤掉 symbol 类型
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: OwnerInvoiceApplyReply | undefined
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerInvoiceApplyReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  selectedButton,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplySlice)
  const [openAudit, setOpenAudit] = useState(false)
  const [openUploadInvoice, setOpenUploadInvoice] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)

  const columns: Column<OwnerInvoiceApplyReply>[] = [
    { key: 'id', headerName: '编号', align: 'center' },
    {
      key: 'invoiceType',
      headerName: '发票类型',
      align: 'center',
      renderCell: row => (row.invoiceType === '1001' ? '个人' : '企业')
    },
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
      renderCell: row =>
        row.stateCd === 'W'
          ? '待审核'
          : row.stateCd === 'U'
            ? '待上传'
            : row.stateCd === 'F'
              ? '审核失败'
              : row.stateCd === 'G'
                ? '待领用'
                : row.stateCd === 'C'
                  ? '已领用'
                  : ''
    },
    { key: 'createdAt', headerName: '申请时间', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => {
        const stateCd = row.stateCd as 'W' | 'U' | 'F' | 'G' | 'C'
        const actions = {
          W: [
            {
              title: '审核',
              color: 'primary' as const,
              icon: <CheckCircle fontSize="small" />,
              onClick: () => setOpenAudit(true)
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
          ],
          U: [
            {
              title: '上传发票',
              color: 'secondary' as const,
              icon: <Upload fontSize="small" />,
              onClick: () => setOpenUploadInvoice(true)
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
          ],
          F: [
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
          ],
          G: [
            {
              title: '重新上传',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => setOpenUploadInvoice(true)
            },
            {
              title: '核销',
              color: 'primary' as const,
              icon: <CheckCircle fontSize="small" />,
              onClick: () => setOpenVerify(true)
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
          ],
          C: [
            {
              title: '重新上传',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => setOpenUploadInvoice(true)
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
          ]
        }
        const relevantActions = actions[stateCd] || []
        return (
          <Box>
            {relevantActions.map((action, index) => (
              <Tooltip title={action.title} key={index}>
                <IconButton size="small" color={action.color} onClick={action.onClick}>
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )
      }
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({
          'page.num': page.num,
          'page.size': page.size,
          ...(selectedButton && { stateCd: selectedButton })
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
  }, [dispatch, page.num, page.size, selectedButton])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <TableList
        rows={list}
        columns={columns}
        setDialogValue={setDialogValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Audit
        dialogValue={dialogValue}
        selectedButton={selectedButton}
        openDialog={openAudit}
        setOpenDialog={setOpenAudit}
      />
      <UploadInvoice
        dialogValue={dialogValue}
        selectedButton={selectedButton}
        openDialog={openUploadInvoice}
        setOpenDialog={setOpenUploadInvoice}
      />
      <Verify
        dialogValue={dialogValue}
        selectedButton={selectedButton}
        openDialog={openVerify}
        setOpenDialog={setOpenVerify}
      />
    </>
  )
}

export default memo(TableData)
