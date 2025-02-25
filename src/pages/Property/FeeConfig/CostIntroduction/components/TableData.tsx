import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeDiscountReply } from 'api/model/property/feeConfig/feeDiscountModel'
import { find } from 'modules/property/feeConfig/feeDiscount'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
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
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    fetchData(
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback((actionType: string, row: FeeDiscountReply) => {
    switch (actionType) {
      case 'edit':
        console.log(row)
        break
      case 'delete':
        break
    }
  }, [])

  const renderActionButtons = (row: FeeDiscountReply) =>
    [{ title: '详情', action: 'details' }].map(({ title, action }) => (
      <Chip
        key={title}
        sx={{
          cursor: 'pointer',
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
      rows={list}
      columns={[
        { field: 'name', headerName: '费用类型', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', flex: 1 },
        { field: 'remark', headerName: '备注', flex: 1 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 200,
          getActions: ({ row }) => renderActionButtons(row)
        }
      ]}
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
