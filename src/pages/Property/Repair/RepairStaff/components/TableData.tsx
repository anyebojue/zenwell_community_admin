import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairStaffReply } from 'api/model/property/repair/repairStaffModel'
import { find } from 'modules/property/repair/repairStaff'
import { Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { RepairSettingReply } from 'api/model/property/repair/repairSettingModel'

const statusValue: Record<string, string> = {
  99: '在线',
  88: '离线'
}

interface TableDataProps {
  rowData: RepairSettingReply
  setDialogValue: Dispatch<SetStateAction<RepairStaffReply | undefined>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  rowData,
  setDialogValue,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairStaffSlice)

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
      { 'page.num': page.num, 'page.size': page.size, repairSettingId: rowData?.id || '' },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, rowData])

  const handleActionClick = useCallback(
    (actionType: string, row: RepairStaffReply) => {
      switch (actionType) {
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDialogValue(row)
          setDelOpen(true)
          break
      }
    },
    [setDialogValue, setOpenDialog, setDelOpen]
  )

  const renderActionButtons = (row: RepairStaffReply) =>
    [
      { title: '变更', action: 'edit' },
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
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={list}
      columns={[
        { field: 'id', headerName: '维修师傅ID', flex: 1 },
        { field: 'staffName', headerName: '师傅名称', flex: 1 },
        {
          field: 'repairSetting.repairTypeName',
          headerName: '报修类型',
          flex: 1,
          renderCell: ({ row }) => row.repairSetting?.repairTypeName
        },
        {
          field: 'statusCd',
          headerName: '状态',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.statusCd!] || '未知'} />
        },
        { field: 'remark', headerName: '说明', flex: 1 },
        { field: 'createdAt', headerName: '创建时间', width: 180 },
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
