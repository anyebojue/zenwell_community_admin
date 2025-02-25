import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeDiscountReply } from 'api/model/property/feeConfig/feeDiscountModel'
import { find } from 'modules/property/feeConfig/feeDiscount'
import { find as findFeeDiscountRule } from 'modules/property/feeConfig/feeDiscountRule'
import { find as findFeeDiscountRuleSpec } from 'modules/property/feeConfig/feeDiscountRuleSpec'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  openDialog: boolean
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<FeeDiscountReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1001': '优惠',
  '2002': '违约',
  '3003': '优惠(需要申请)'
}

const TableData: React.FC<TableDataProps> = ({
  openDialog,
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeDiscountSlice)

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
    if (openDialog) {
      fetchData(
        findFeeDiscountRule,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
      fetchData(
        findFeeDiscountRuleSpec,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
    } else {
      fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    }
  }, [fetchData, openDialog, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: FeeDiscountReply) => {
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
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: FeeDiscountReply) =>
    [
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
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

  return (
    <DataGrid
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'name', headerName: '折扣名称', flex: 1 },
        {
          field: 'discountType',
          headerName: '折扣类型',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.discountType!] || '未知类型'} />
        },
        {
          field: 'ruleId',
          headerName: '规则名称',
          flex: 1,
          renderCell: ({ row }) => {
            const firstSpec = row.feeDiscountSpec?.[0]
            return firstSpec?.feeDiscountRuleSpec?.feeDiscountRule?.name || '无规则'
          }
        },
        {
          field: 'feeDiscountSpec',
          headerName: '规则',
          width: 500,
          renderCell: ({ row }) =>
            row.feeDiscountSpec?.map(item => `${item.name}：${item.specValue}；`)
        },
        { field: 'createdAt', headerName: '创建时间', width: 180 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
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
