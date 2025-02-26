import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { PayFeeReply } from 'api/model/property/feeConfig/payFeeModel'
import { find } from 'modules/property/feeConfig/payFee'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { Box, Button, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Add } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import FormMeterReading from './FormMeterReading'
import FormProvisionalCharge from './FormProvisionalCharge'
import FormPaymentByVolume from './FormPaymentByVolume'
import FormCreationCost from './FormCreationCost'

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
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PayFeeSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const [openDialog, setOpenDialog] = useState(false)
  const [openTemporarily, setOpenTemporarily] = useState(false)
  const [openVolume, setOpenVolume] = useState(false)
  const [openExpense, setOpenExpense] = useState(false)

  const buttonList = [
    { label: '批量缴费', onClick: () => {} },
    { label: '临时收费', onClick: () => setOpenTemporarily(true) },
    { label: '按量缴费', onClick: () => setOpenVolume(true) },
    { label: '水电抄表', onClick: () => setOpenDialog(true) },
    { label: '费用套餐', onClick: () => {} },
    { label: '创建费用', onClick: () => setOpenExpense(true) },
    { label: '欠费缴费', onClick: () => {} }
  ]

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
    fetchData(findFeeConfigType, {}, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback((actionType: string, row: PayFeeReply) => {
    switch (actionType) {
      case 'fee':
        break
      case 'history':
        break
      case 'cancel':
        break
      case 'finish':
        break
      case 'change':
        break
      case 'details':
        break
    }
  }, [])

  const renderActionButtons = (row: PayFeeReply) => {
    const actions = [
      { title: '缴费', action: 'fee' },
      { title: '缴费历史', action: 'history' },
      { title: '取消费用', action: 'cancel' },
      { title: '手工结束', action: 'finish' },
      { title: '费用变更', action: 'change' },
      { title: '详情', action: 'details' }
    ]
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {actions.map(({ title, action }) => (
          <Chip
            key={title}
            sx={{
              cursor: 'pointer',
              width: 'calc(33.33%)',
              '& .MuiChip-label': {
                fontSize: '13px'
              }
            }}
            label={title}
            color="primary"
            variant="outlined"
            onClick={() => handleActionClick(action, row)}
          />
        ))}
      </Box>
    )
  }

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
          {buttonList.map(({ label, onClick }) => (
            <Button
              key={label}
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonCommonStyle()}
              onClick={onClick}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Box>
      <DataGrid
        sx={{ mt: 2 }}
        getRowHeight={() => 100}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        rows={list}
        columns={[
          {
            field: 'feeConfig.name',
            headerName: '费用项目',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.feeConfig?.name
          },
          {
            field: 'feeFlag',
            headerName: '费用标识',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusValue[row.feeFlag!] || '未知类型'} />
          },
          {
            field: 'feeConfig.feeConfigType.name',
            headerName: '费用类型',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.feeConfig?.feeConfigType?.name
          },
          {
            field: 'computeAccount.payableAmount',
            headerName: '应收金额',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => row.computeAccount?.payableAmount
          },
          {
            field: 'createdAt',
            headerName: '建账时间',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ value }) => (
              <Box
                sx={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  lineHeight: '1.2',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {value}
              </Box>
            )
          },
          {
            field: 'startTime',
            headerName: '应收时间段',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ value }) => (
              <Box
                sx={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  lineHeight: '1.2',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {value}
              </Box>
            )
          },
          {
            field: 'remark',
            headerName: '说明',
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
                {row.meterWater?.preDegrees !== 0 && (
                  <Typography variant="body1">上期度数：{row.meterWater?.preDegrees}</Typography>
                )}
                {row.meterWater?.curDegrees !== 0 && (
                  <Typography variant="body1">本期度数：{row.meterWater?.curDegrees}</Typography>
                )}
                {row.consumption && Number(row.consumption) > 0 && (
                  <Typography variant="body1">用量：{row.consumption}</Typography>
                )}
                {row.amount !== 0 && <Typography variant="body1">单价：{row.amount}</Typography>}
                {row.feeConfig?.additionalAmount !== 0 && (
                  <Typography variant="body1">附加费：{row.feeConfig?.additionalAmount}</Typography>
                )}
              </Box>
            )
          },
          {
            field: 'status',
            headerName: '状态',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => <Chip label={statusTypeValue[row.status!] || '未知类型'} />
          },
          {
            field: 'actions',
            headerName: '操作',
            type: 'actions',
            width: 250,
            getActions: ({ row }) => {
              return [renderActionButtons(row)]
            }
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
      <FormMeterReading
        dialogValue={dialogValue}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <FormProvisionalCharge
        dialogValue={dialogValue}
        openDialog={openTemporarily}
        setOpenDialog={setOpenTemporarily}
      />
      <FormPaymentByVolume
        dialogValue={dialogValue}
        openDialog={openVolume}
        setOpenDialog={setOpenVolume}
      />
      <FormCreationCost
        dialogValue={dialogValue}
        openDialog={openExpense}
        setOpenDialog={setOpenExpense}
      />
    </>
  )
}

export default memo(TableData)
