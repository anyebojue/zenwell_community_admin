import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountReply } from 'api/model/property/feeConfig/applyRoomDiscountModel'
import { find } from 'modules/property/feeConfig/applyRoomDiscount'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findApplyRoomDiscountType } from 'modules/property/feeConfig/applyRoomDiscountType'
import { find as findFeeDiscount } from 'modules/property/feeConfig/feeDiscount'
import { Box, Chip, Typography } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'

interface TableDataProps {
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<ApplyRoomDiscountReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '1': '申请验房',
  '2': '验房通过',
  '3': '验房不通过',
  '4': '审批通过',
  '5': '审批不通过'
}

const statusReturnWay: Record<string, string> = {
  '1001': '折扣',
  '1002': '账户余额'
}

const statusInUse: Record<string, string> = {
  '0': '可用',
  '1': '不可用'
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.ApplyRoomDiscountSlice)

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
    fetchData(findFeeConfig, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findApplyRoomDiscountType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findFeeDiscount, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: ApplyRoomDiscountReply) => {
      switch (actionType) {
        case 'inspection':
          setDialogType('inspection')
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'record':
          navigate('/FeeConfig/TraceRecord', { state: { value: row } })
          break
        case 'examine':
          setDialogType('examine')
          setDialogValue(row)
          setOpenDialog(true)
          break
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
    [setDialogType, setDialogValue, setOpenDialog, navigate, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ApplyRoomDiscountReply) => {
    const actions = [
      { title: '验房', action: 'inspection', stateCd: '1' },
      { title: '跟踪记录', action: 'record' },
      { title: '审核', action: 'examine', stateCd: '2' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    return actions
      .filter(({ stateCd }) => stateCd === undefined || row.stateCd === stateCd)
      .map(({ title, action }) => (
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
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'roomId',
          headerName: '房屋(楼栋-单元-房屋)',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'discountId',
          headerName: '折扣名称',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) => row.feeDiscount?.name
        },
        {
          field: 'applyType',
          headerName: '申请类型',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.applyType!] || '未知类型'} />
        },
        {
          field: 'createUserName',
          headerName: '申请人',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'createUserTel',
          headerName: '申请电话',
          headerAlign: 'center',
          align: 'center',
          width: 50
        },
        {
          field: 'startTime',
          headerName: '时间',
          width: 180,
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
              <Typography variant="body1">{row.startTime}～</Typography>
              <Typography variant="body1">{row.endTime}</Typography>
            </Box>
          )
        },
        {
          field: 'stateCd',
          headerName: '状态',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.applyType!] || '未知类型'} />
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          width: 120,
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
          field: 'inUse',
          headerName: '使用状态',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusInUse[row.returnWay!] || '未知类型'} />
        },
        {
          field: 'returnWay',
          headerName: '返还类型',
          width: 100,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusReturnWay[row.returnWay!] || '未知类型'} />
        },
        {
          field: 'returnAmount',
          headerName: '返还金额',
          headerAlign: 'center',
          align: 'center',
          width: 50
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 250,
          headerAlign: 'center',
          align: 'center',
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
