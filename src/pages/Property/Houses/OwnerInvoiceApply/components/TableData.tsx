import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'
import { find } from 'modules/property/houses/ownerInvoiceApply'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'
import { useNavigate } from 'react-router-dom'
import Audit from './Audit'
import UploadInvoice from './UploadInvoice'
import Verify from './Verify'

interface TableDataProps {
  dialogValue: OwnerInvoiceApplyReply | undefined
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<OwnerInvoiceApplyReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusType: Record<string, string> = {
  '1001': '个人',
  '2002': '企业'
}

const statusValue: Record<string, string> = {
  W: '待审核',
  U: '待上传',
  F: '审核失败',
  G: '待领用',
  C: '已领用'
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  selectedButton,
  setDialogValue,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplySlice)
  const [openAudit, setOpenAudit] = useState(false)
  const [openUploadInvoice, setOpenUploadInvoice] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(
      find,
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { stateCd: selectedButton })
      },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerInvoiceApplyReply) => {
      switch (actionType) {
        case 'audit':
          setDialogValue(row)
          setOpenAudit(true)
          break
        case 'upload':
          setDialogValue(row)
          setOpenUploadInvoice(true)
          break
        case 'reupload':
          setDialogValue(row)
          setOpenUploadInvoice(true)
          break
        case 'verify':
          setDialogValue(row)
          setOpenVerify(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'detail':
          navigate('/houses/OwnerInvoiceApplyDetail', { state: { value: row } })
          break
      }
    },
    [setDialogValue, setDelOpen, setSelectedRows, navigate]
  )

  const renderActionButtons = (row: OwnerInvoiceApplyReply) => {
    const stateCd = row.stateCd as 'W' | 'U' | 'F' | 'G' | 'C'
    const stateActionsMap: Record<typeof stateCd, { title: string; action: string }[]> = {
      W: [
        { title: '审核', action: 'audit' },
        { title: '删除', action: 'delete' },
        { title: '详情', action: 'detail' }
      ],
      U: [
        { title: '上传发票', action: 'upload' },
        { title: '删除', action: 'delete' },
        { title: '详情', action: 'detail' }
      ],
      F: [
        { title: '删除', action: 'delete' },
        { title: '详情', action: 'detail' }
      ],
      G: [
        { title: '重新上传', action: 'reupload' },
        { title: '核销', action: 'verify' },
        { title: '删除', action: 'delete' },
        { title: '详情', action: 'detail' }
      ],
      C: [
        { title: '重新上传', action: 'reupload' },
        { title: '删除', action: 'delete' },
        { title: '详情', action: 'detail' }
      ]
    }
    const actions = stateActionsMap[stateCd] || []
    return actions.map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
          marginRight: '-5px',
          '& .MuiChip-label': {
            fontSize: '13px'
          }
        }}
        label={title}
        color="primary"
        variant="outlined"
        onClick={() => handleActionClick(action, row)}
      />
    ))
  }

  return (
    <>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2'
          },
          mt: 1
        }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          { field: 'id', headerName: '编号', width: 200, headerAlign: 'center', align: 'center' },
          {
            field: 'invoiceType',
            headerName: '发票类型',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusType[row.invoiceType!] || '未知'} />
          },
          {
            field: 'ownerName',
            headerName: '业主名称',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'createUserName',
            headerName: '申请人',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'ownerInvoice.invoiceName',
            headerName: '发票名头',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.ownerInvoice?.invoiceName
          },
          {
            field: 'ownerInvoice.invoiceNum',
            headerName: '纳税人识别号',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.ownerInvoice?.invoiceNum
          },
          {
            field: 'ownerInvoice.invoiceAddress',
            headerName: '地址',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.ownerInvoice?.invoiceAddress
          },
          {
            field: 'ownerInvoice.invoiceLink',
            headerName: '电话',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.ownerInvoice?.invoiceLink
          },
          {
            field: 'invoiceAmount',
            headerName: '申请金额',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'invoiceCode',
            headerName: '发票号',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'stateCd',
            headerName: '审核状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知'} />
          },
          {
            field: 'createdAt',
            headerName: '申请时间',
            width: 170,
            headerAlign: 'center',
            align: 'center'
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 210,
            getActions: ({ row }) => renderActionButtons(row),
            headerAlign: 'center',
            align: 'center'
          }
        ]}
        onRowSelectionModelChange={handleRowSelection}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationMode="server"
        rowCount={Number(page.total)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: Number(page.size)
            }
          }
        }}
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
