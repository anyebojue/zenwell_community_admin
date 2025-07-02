import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/machine'
import { find as findParking } from 'modules/property/parking/parkingArea'
import { MachineReply } from 'api/model/property/parking/machineModel'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Chip } from '@mui/material'

const statusValue: Record<string, string> = {
  '3306': '进',
  '3307': '出'
}

const statusCd: Record<string, string> = {
  '1300': '设备离线',
  '1400': '设备在线'
}

interface TableDataProps {
  selectedButton: string
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<MachineReply | undefined>>
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}
const TableData: React.FC<TableDataProps> = ({
  selectedButton,
  setDialogType,
  setDialogValue,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.MachineSlice)

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
        findParking,
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
    (actionType: string, row: MachineReply) => {
      switch (actionType) {
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
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: MachineReply) =>
    [
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
        {
          field: 'machineCode',
          headerName: '设备编码',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'machineName',
          headerName: '设备名称',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'machineIp',
          headerName: '设备IP',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'direction',
          headerName: '设备方向',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusValue[row.direction!] || '未知'} />
        },
        { field: '', headerName: '道闸厂家', flex: 1, headerAlign: 'center', align: 'center' },
        { field: '', headerName: '岗亭', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'stateCd',
          headerName: '状态',
          flex: 1,
          headerAlign: 'center',
          align: 'center',
          renderCell: ({ row }) => <Chip label={statusCd[row.stateCd!] || '未知'} />
        },
        { field: '', headerName: '监控视频', flex: 1, headerAlign: 'center', align: 'center' },
        {
          field: 'heartbeatTime',
          headerName: '心跳时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
        {
          field: 'createdAt',
          headerName: '创建时间',
          flex: 1,
          headerAlign: 'center',
          align: 'center'
        },
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
