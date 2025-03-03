import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeConfigReply } from 'api/model/property/feeConfig/feeConfigModel'
import { find } from 'modules/property/feeConfig/feeConfig'
import { find as finFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  selectedButton: string
  setDialogValue: Dispatch<SetStateAction<FeeConfigReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1003006': '周期性费用',
  '2006012': '一次性费用'
}

const statusPaymentValue: Record<string, string> = {
  '1200': '预付费',
  '2100': '后付费'
}

const statusFormulaValue: Record<string, string> = {
  '1001': '建筑面积*单价+附加费',
  '2002': '固定费用',
  '4004': '动态费用',
  '5005': '(本期度数-上期度数)*单价+附加费',
  '6006': '用量*单价+附加费',
  '7007': '自定义公式',
  '9009': '(本期度数-上期度数)*动态单价+附加费',
  '1101': '租金',
  '3003': '室内面积*单价+附加费',
  '1102': '租金(递增)'
}

const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.FeeConfigSlice)

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
      {
        'page.num': page.num,
        'page.size': page.size,
        ...(selectedButton && { feeTypeCd: selectedButton })
      },
      '正在加载列表中，请稍后...'
    )
    if (selectedButton === '') {
      fetchData(
        finFeeConfigType,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: FeeConfigReply) => {
      switch (actionType) {
        case 'discount':
          navigate('/FeeConfig/ExpenseDiscount', { state: { data: row } })
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
        case 'details':
          navigate('/FeeConfig/ExpenseItemInformation', { state: { value: row } })
          break
      }
    },
    [navigate, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: FeeConfigReply) =>
    [
      { title: '折扣', action: 'discount' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' },
      { title: '详情', action: 'details' }
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
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.2'
        }
      }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'feeTypeCd',
          headerName: '费用类型',
          flex: 1,
          renderCell: ({ row }) => row.feeConfigType?.name
        },
        { field: 'name', headerName: '收费项目', flex: 1 },
        {
          field: 'feeFlag',
          headerName: '费用标识',
          width: 100,
          renderCell: ({ row }) => <Chip label={statusValue[row.feeFlag!] || '未知类型'} />
        },
        {
          field: 'paymentCd',
          headerName: '	付费类型',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusPaymentValue[row.paymentCd!] || '未知类型'} />
        },
        { field: 'paymentCycle', headerName: '缴费周期(单位:月)	', flex: 1 },
        {
          field: 'computingFormula',
          headerName: '公式',
          width: 180,
          renderCell: ({ row }) => (
            <Chip label={statusFormulaValue[row.computingFormula!] || '未知类型'} />
          )
        },
        { field: 'squarePrice', headerName: '计费单价(单位:元)', flex: 1 },
        { field: 'additionalAmount', headerName: '附加/固定费用(单位:元)', flex: 1 },
        {
          field: 'deductFrom',
          headerName: '账户抵扣',
          flex: 1,
          renderCell: ({ row }) => (row.deductFrom === 'Y' ? '是' : '否')
        },
        { field: 'status', headerName: '状态', flex: 1 },
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
