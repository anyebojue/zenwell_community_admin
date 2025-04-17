import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportFeeYearCollectionDetailReply } from 'api/model/property/report/queryPayFeeDepositModel'
import { find } from 'modules/property/report/queryPayFeeDeposit'
import { find as findHousing } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {}

const TableData: React.FC<TableDataProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ReportQueryPayFeeDepositSlice)

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
      { 'page.num': page.num, 'page.size': page.size, is_export: true },
      '正在加载列表中，请稍后...'
    )
    fetchData(findHousing, { 'page.disable': true }, '正在加载房屋列表中，请稍后...')
    fetchData(findUnit, { 'page.disable': true }, '正在加载单元列表中，请稍后...')
    fetchData(findFeeConfig, { 'page.disable': true }, '正在加载费用配置列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: ReportFeeYearCollectionDetailReply) => {
      switch (actionType) {
        case 'details':
          navigate('/feeConfig/RefundDetails', { state: { value: row } })
          break
      }
    },
    [navigate]
  )

  const renderActionButtons = (row: ReportFeeYearCollectionDetailReply) => {
    const actionButtons = [{ title: '详情', action: 'details', condition: true }]
    return actionButtons.map(({ title, action }) => (
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
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'objName', headerName: '房号', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'ownerName', headerName: '业主', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'feeTypeCdName',
          headerName: '费用类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'feeName', headerName: '费用项', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'startTime',
          headerName: '费用开始时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'deadlineTime',
          headerName: '费用结束时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createTime',
          headerName: '创建时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'payerObjTypeName',
          headerName: '付费对象类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'payerObjId',
          headerName: '付款方ID',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'additionalAmount',
          headerName: '应收金额',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'stateName',
          headerName: '状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'state',
          headerName: '退费状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => (row.state === '2009001' ? '已缴费' : '未缴费')
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
  )
}

export default memo(TableData)
