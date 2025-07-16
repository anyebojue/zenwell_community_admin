import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ImportFeeReply } from 'api/model/property/feeConfig/importFeeModel'
import { find } from 'modules/property/feeConfig/importFee'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findFeeFormula } from 'modules/property/feeConfig/feeFormula'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  expense: boolean
}

const statusValue: Record<string, string> = {
  '1010301': '普通房屋',
  '2020602': '商铺'
}

const statuValue: Record<string, string> = {
  '1001': '当前小区',
  '2002': '楼栋',
  '3003': '单元'
}

const TableData: React.FC<TableDataProps> = ({ expense }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ImportFeeSlice)
  const { list: typeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const result = typeList.reduce(
    (acc: Record<string, string>, item) => {
      if (item.id) {
        acc[item.id] = item.name || ''
      }
      return acc
    },
    {} as Record<string, string>
  )

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
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
    if (expense) {
      fetchData(
        findFeeFormula,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
      fetchData(
        findFloor,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
      fetchData(
        findUnit,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
    } else {
      fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
    }
  }, [expense, fetchData, page.num, page.size])

  const handleActionClick = useCallback(
    (actionType: string, row: ImportFeeReply) => {
      switch (actionType) {
        case 'details':
          navigate('/feeConfig/ImportFeeDetails', { state: { value: row } })
          break
      }
    },
    [navigate]
  )

  const renderActionButtons = (row: ImportFeeReply) =>
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
        {
          field: 'name',
          headerName: '费用名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'feeTypeCd',
          headerName: '费用类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={result[row.feeTypeCd!] || '-'} />
        },
        {
          field: 'feeFlag',
          headerName: '房屋类型',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.feeFlag!] || '-'} />
        },
        {
          field: 'paymentCycle',
          headerName: '使用量',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'paymentCd',
          headerName: '公摊范围',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statuValue[row.paymentCd!] || '-'} />
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
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
