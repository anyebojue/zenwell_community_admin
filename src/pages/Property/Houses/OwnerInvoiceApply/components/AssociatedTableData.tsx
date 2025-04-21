import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'
import { find } from 'modules/property/houses/ownerInvoice'
import { Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { GridRowSelectionModel } from '@mui/x-data-grid-pro'
import { buttonStyles } from 'components/DeleteModal'

interface AssociatedTableDataProps {
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOwnerInvoice: Dispatch<SetStateAction<OwnerInvoiceApplyReply | undefined>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  setSelectedRows,
  setOwnerInvoice,
  setAssociatedOpen
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
    (actionType: string, row: OwnerInvoiceApplyReply) => {
      switch (actionType) {
        case 'select':
          setOwnerInvoice(row)
          setAssociatedOpen(false)
          break
      }
    },
    [setAssociatedOpen, setOwnerInvoice]
  )

  const renderActionButtons = (row: OwnerInvoiceApplyReply) => {
    const actions = [{ title: '选择', action: 'select' }]
    return actions.map(({ title, action }) => (
      <Button
        key={title}
        size="small"
        variant="contained"
        color="error"
        sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
        onClick={() => handleActionClick(action, row)}
      >
        选择
      </Button>
    ))
  }

  return (
    <DataGrid
      sx={{ mt: 1, width: '800px' }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
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
          align: 'center'
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
          headerName: '地址',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'invoiceLink',
          headerName: '电话',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 100,
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

export default memo(AssociatedTableData)
