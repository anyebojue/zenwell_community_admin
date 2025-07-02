import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeBatchReply } from 'api/model/property/feeConfig/payFeeBatchModel'
import { find } from 'modules/property/feeConfig/payFeeBatch'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<PayFeeBatchReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const statusValue: Record<string, string> = {
  '2006001': '正常',
  '2007001': '申请取消',
  '2008001': '审核通过',
  '2009001': '审核失败'
}

const TableData: React.FC<TableDataProps> = ({ setDialogValue, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.PayFeeBatchSlice)

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
    (actionType: string, row: PayFeeBatchReply) => {
      switch (actionType) {
        case 'delete':
          setOpenDialog(true)
          setDialogValue(row)
          break
      }
    },
    [setDialogValue, setOpenDialog]
  )

  const renderActionButtons = (row: PayFeeBatchReply) =>
    [{ title: '取消申请', action: 'delete' }].map(({ title, action }) => (
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
        { field: 'id', headerName: '批次号', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'createUserName',
          headerName: '员工',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        { field: 'createdAt', headerName: '时间', headerAlign: 'center', align: 'center', flex: 1 },
        { field: 'msg', headerName: '取消原因', headerAlign: 'center', align: 'center', flex: 1 },
        {
          field: 'stateCd',
          headerName: '审核状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.stateCd!] || '未知类型'} />
        },
        {
          field: 'remark',
          headerName: '审核意见',
          headerAlign: 'center',
          align: 'center',
          flex: 1
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
