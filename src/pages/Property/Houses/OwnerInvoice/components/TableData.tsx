import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceReply } from 'api/model/property/houses/ownerInvoiceModel'
import { find } from 'modules/property/houses/ownerInvoice'
import { Box, Chip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<OwnerInvoiceReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1001': '个人',
  '2002': '企业'
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceSlice)

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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: OwnerInvoiceReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setDialogType, setDialogValue, setOpenDialog, setSelectedRows]
  )

  const renderActionButtons = (row: OwnerInvoiceReply) => {
    const actions = [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
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
    <DataGrid
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        },
        mt: 1
      }}
      getRowHeight={() => 70}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '编号', width: 200, headerAlign: 'center', align: 'center' },
        {
          field: 'ownerName',
          headerName: '业主名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'invoiceType',
          headerName: '发票类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.invoiceType!] || '未知'} />
        },
        {
          field: 'invoiceName',
          headerName: '发票名头',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'invoiceNum',
          headerName: '纳税人识别号',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'invoiceAddress',
          headerName: '地址/电话',
          width: 200,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">地址：{row.invoiceAddress}</Typography>
              <Typography variant="body1">电话：{row.invoiceLink}</Typography>
            </Box>
          )
        },
        {
          field: 'invoiceAccount',
          headerName: '开户行及账号',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 280,
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
  )
}

export default memo(TableData)
