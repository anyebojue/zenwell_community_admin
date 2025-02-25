import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReturnPayFeeReply } from 'api/model/property/feeConfig/returnPayFeeModel'
import { find } from 'modules/property/feeConfig/returnPayFee'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ReturnPayFeeReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ReturnPayFeeSlice)

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

  const handleActionClick = useCallback(
    (actionType: string, row: ReturnPayFeeReply) => {
      switch (actionType) {
        case 'details':
          navigate('/FeeConfig/RefundDetails', { state: { value: row } })
          setDialogValue(row)
          break
        case 'fee':
          setOpenDialog(true)
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog]
  )

  const renderActionButtons = (row: ReturnPayFeeReply) => {
    const actionButtons = [
      { title: '详情', action: 'details' },
      { title: '审核费用', action: 'fee' }
    ]
    return actionButtons.map(({ title, action }) => (
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
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: '', headerName: '房屋', flex: 1 },
        { field: '', headerName: '费用项目', flex: 1 },
        { field: '', headerName: '付费周期', flex: 1 },
        { field: '', headerName: '缴费起始时间', flex: 1 },
        { field: '', headerName: '缴费结束时间', flex: 1 },
        { field: '', headerName: '应付金额（单位：元）', flex: 1 },
        { field: '', headerName: '实付金额（单位：元）', flex: 1 },
        { field: '', headerName: '操作员工', flex: 1 },
        { field: '', headerName: '缴费时间', flex: 1 },
        { field: '', headerName: '审核状态', flex: 1 },
        { field: '', headerName: '审核说明', flex: 1 },
        { field: '', headerName: '缴费备注', flex: 1 },
        {
          field: 'actions',
          headerName: '详情',
          type: 'actions',
          width: 300,
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
