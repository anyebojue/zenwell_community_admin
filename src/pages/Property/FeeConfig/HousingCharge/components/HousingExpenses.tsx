import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { PayFeeReply } from 'api/model/property/feeConfig/payFeeModel'
import { find } from 'modules/property/feeConfig/payFee'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { Box, Button, Chip, MenuItem, Stack, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Add } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

const buttonCommonStyle = (color: string = '#2660ad', height: string = '32px') => ({
  ...buttonStyles(color, '#1d428a'),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

interface TableDataProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
}

const statusValue: Record<string, string> = {
  '1003006': '周期性费用',
  '2006012': '一次性费用'
}

const statusTypeValue: Record<string, string> = {
  '2008001': '有效',
  '2009001': '收费结束'
}

const TableData: React.FC<TableDataProps> = ({ dialogValue }) => {
  console.log(dialogValue)
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PayFeeSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)

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
      { 'page.num': page.num, 'page.size': page.size, 'computeAccountRequest.cycles': '1' },
      '正在加载列表中，请稍后...'
    )
    fetchData(findFeeConfigType, {}, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback((actionType: string, row: PayFeeReply) => {
    switch (actionType) {
      case 'edit':
        console.log(row)
        break
      case 'delete':
        break
    }
  }, [])

  const renderActionButtons = (row: PayFeeReply) =>
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
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            sx={{ width: '150px' }}
            label="请选择费用类型"
            select
            size="small"
            variant="outlined"
          >
            {feeConfigTypeList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            sx={{ width: '150px' }}
            label="请选择状态"
            select
            size="small"
            variant="outlined"
          >
            {[
              { value: '2008001', label: '有效' },
              { value: '2009001', label: '收费结束' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            批量缴费
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            临时收费
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            按量缴费
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            水电抄表
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            费用套餐
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            创建费用
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={buttonCommonStyle()}
            onClick={() => {}}
          >
            欠费缴费
          </Button>
        </Stack>
      </Box>
      <DataGrid
        sx={{ mt: 2 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          { field: 'feeConfig.name', headerName: '费用项目', flex: 1 },
          {
            field: 'feeFlag',
            headerName: '费用标识',
            flex: 1,
            renderCell: ({ row }) => <Chip label={statusValue[row.feeFlag!] || '未知类型'} />
          },
          { field: 'feeConfig.feeConfigType.name', headerName: '费用类型', flex: 1 },
          { field: 'computeAccount.payableAmount', headerName: '应收金额', flex: 1 },
          { field: 'createTime', headerName: '建账时间', flex: 1 },
          { field: 'startTime', headerName: '应收时间段', flex: 1 },
          { field: 'remark', headerName: '说明', flex: 1 },
          {
            field: 'status',
            headerName: '状态',
            flex: 1,
            renderCell: ({ row }) => <Chip label={statusTypeValue[row.status!] || '未知类型'} />
          },
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
    </>
  )
}

export default memo(TableData)
