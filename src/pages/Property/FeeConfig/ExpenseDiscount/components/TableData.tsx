import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeConfigDiscountReply } from 'api/model/property/feeConfig/payFeeConfigDiscountModel'
import { find } from 'modules/property/feeConfig/payFeeConfigDiscount'
import { Box, Chip, Typography } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { FeeConfigReply } from 'api/model/property/feeConfig/feeConfigModel'

interface TableDataProps {
  data: FeeConfigReply
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ data, setSelectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PayFeeConfigDiscountSlice)

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
      { 'page.num': page.num, 'page.size': page.size, configId: data.id || '' },
      '正在加载列表中，请稍后...'
    )
  }, [data.id, fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: PayFeeConfigDiscountReply) => {
      switch (actionType) {
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: PayFeeConfigDiscountReply) =>
    [{ title: '删除', action: 'delete' }].map(({ title, action }) => (
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
      sx={{ mt: 1 }}
      getRowHeight={() => 100}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'configId',
          headerName: '费用项名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeConfig?.feeConfigType?.name
        },
        {
          field: 'discountId',
          headerName: '折扣名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => row.feeConfig?.name
        },
        {
          field: 'remark',
          headerName: '规则',
          flex: 1,
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
              {row.feeConfig?.feeConfigType?.status !== 0 && (
                <Typography variant="body1">
                  欠费时长：{row.feeConfig?.feeConfigType?.status}
                </Typography>
              )}
              {row.feeConfig?.feeConfigType?.status !== 0 && (
                <Typography variant="body1">
                  打折率：{row.feeConfig?.feeConfigType?.status}
                </Typography>
              )}
              {row.feeConfig?.feeConfigType?.status !== 0 && (
                <Typography variant="body1">
                  月份：{row.feeConfig?.feeConfigType?.status}
                </Typography>
              )}
            </Box>
          )
        },
        {
          field: 'discountType',
          headerName: '折扣类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (row.feeDiscount?.discountType === '1001' ? '优惠' : '违约')
        },
        { field: 'startTime', headerName: '缴费时间段', flex: 1 },
        { field: 'endTime', headerName: '折扣终止时间', flex: 1 },
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
