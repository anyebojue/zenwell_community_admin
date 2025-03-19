import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportCustomComponentFooterReply } from 'api/model/platform/reportConfiguration/reportCustomComponentFooterModel'
import { find } from 'modules/platform/reportConfiguration/reportCustomComponentFooter'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { ReportCustomComponentReply } from 'api/model/platform/reportConfiguration/reportCustomComponentModel'

const statusType: Record<string, string> = {
  '1': 'sql',
  '2': 'go'
}

interface TableDataProps {
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDialogValue: Dispatch<SetStateAction<ReportCustomComponentFooterReply>>
  setDialogType: Dispatch<SetStateAction<string>>
  valueData: ReportCustomComponentReply
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setOpenDialog,
  setDialogValue,
  setDialogType,
  valueData,
  setSelectedRows,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ReportCustomComponentFooterSlice)

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
      { 'page.num': page.num, 'page.size': page.size, componentId: valueData.id! },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, valueData.id])

  const handleActionClick = useCallback(
    (actionType: string, row: ReportCustomComponentFooterReply) => {
      switch (actionType) {
        case 'edit':
          setDialogValue(row)
          setDialogType('edit')
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setDialogType, setDialogValue, setOpenDialog, setSelectedRows]
  )

  const renderActionButtons = (row: ReportCustomComponentFooterReply) =>
    [
      { title: '编辑', action: 'edit' },
      { title: '删除', action: 'delete' }
    ].map(({ title, action }) => (
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
        { field: 'id', headerName: '统计ID', flex: 1 },
        { field: 'name', headerName: '名称', flex: 1 },
        {
          field: 'queryModel',
          headerName: '查询方式',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusType[row.queryModel!] || '未知'} />
        },
        { field: 'remark', headerName: '描述', flex: 1 },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 150,
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
