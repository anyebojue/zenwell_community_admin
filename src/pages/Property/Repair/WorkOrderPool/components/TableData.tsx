import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { find } from 'modules/property/repair/repairPool'
import { find as findRepairSetting } from 'modules/property/repair/repairSetting'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { useNavigate } from 'react-router-dom'
import SendOrders from './SendOrders'

const statusValue: Record<string, string> = {
  1001: '有偿服务',
  2001: '无偿服务'
}

interface TableDataProps {
  dialogValue: RepairPoolReply | undefined
  selectedButton: number
  setDialogValue: Dispatch<SetStateAction<RepairPoolReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  selectedButton,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')
  const [sendOpen, setSendOpen] = useState(false)

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
        ...(selectedButton !== 0 && {
          statusCd: String(selectedButton)
        })
      },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findRepairSetting,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, selectedButton])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: RepairPoolReply) => {
      switch (actionType) {
        case 'orders':
          setDialogValue(row)
          setSendOpen(true)
          break
        case 'details':
          setDialogValue(row)
          navigate('/repair/work-order-details', { state: { value: row } })
          break
        case 'edit':
          setDialogValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDialogValue, navigate, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: RepairPoolReply) =>
    [
      { title: '派单', action: 'orders' },
      { title: '详情', action: 'details' },
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
      <DataGrid
        sx={{ mt: 1 }}
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        disableColumnResize
        disableVirtualization={false}
        checkboxSelection
        rows={list}
        columns={[
          { field: 'id', headerName: '工单编码', flex: 1 },
          { field: 'communityId', headerName: '位置', flex: 1, renderCell: () => community.name },
          {
            field: 'repairSetting.repairTypeName',
            headerName: '报修类型',
            flex: 1,
            renderCell: ({ row }) => row.repairSetting?.repairTypeName
          },
          {
            field: 'maintenanceType',
            headerName: '维修类型',
            flex: 1,
            renderCell: ({ row }) => <Chip label={statusValue[row.maintenanceType!] || '未知'} />
          },
          { field: 'repairName', headerName: '报修人', flex: 1 },
          { field: 'tel', headerName: '联系方式', flex: 1 },
          { field: 'appointmentTime', headerName: '预约时间', flex: 1 },
          { field: 'createdAt', headerName: '提交时间', width: 180 },
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
      <SendOrders dialogValue={dialogValue} sendOpen={sendOpen} setSendOpen={setSendOpen} />
    </>
  )
}

export default memo(TableData)
