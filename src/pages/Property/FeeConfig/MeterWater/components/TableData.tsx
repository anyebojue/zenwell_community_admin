import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'
import { find } from 'modules/property/feeConfig/meterWater'
import { find as findMeterType } from 'modules/property/feeConfig/meterType'
import { Chip } from '@mui/material'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'

interface TableDataProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
  dialogType: string
  setDialogMeterWaterValue: Dispatch<SetStateAction<MeterWaterReply>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDialogType: Dispatch<SetStateAction<string>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  dialogValue,
  dialogType,
  setDialogMeterWaterValue,
  setSelectedRows,
  setOpenDialog,
  setDialogType,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.MeterWaterSlice)
  const { list: meterTypeList } = useSelector((state: RootState) => state.MeterTypeSlice)

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
    fetchData(findMeterType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, objId: dialogValue.roomData?.id || '' },
      '正在加载列表中，请稍后...'
    )
  }, [dialogType, dialogValue.roomData?.id, fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: MeterWaterReply) => {
      switch (actionType) {
        case 'edit':
          setDialogType('edit')
          setDialogMeterWaterValue(row)
          setOpenDialog(true)
          break
        case 'delete':
          setDelOpen(true)
          setSelectedRows(new Set([row.id || '']))
          break
      }
    },
    [setDelOpen, setDialogMeterWaterValue, setDialogType, setOpenDialog, setSelectedRows]
  )

  const renderActionButtons = (row: MeterWaterReply) =>
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
      sx={{ mt: 2 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        {
          field: 'meterType',
          headerAlign: 'center',
          headerName: '表类型',
          align: 'center',
          flex: 1,
          renderCell: ({ row }) => {
            const meter = meterTypeList.find(item => item.id === row.meterType)
            return <Chip label={meter ? meter.name : '未知状态'} />
          }
        },
        {
          field: 'objName',
          headerAlign: 'center',
          headerName: '对象名称',
          align: 'center',
          width: 100
        },
        {
          field: 'preDegrees',
          headerAlign: 'center',
          headerName: '上期度数',
          align: 'center',
          flex: 1
        },
        {
          field: 'curDegrees',
          headerAlign: 'center',
          headerName: '本期度数',
          align: 'center',
          flex: 1
        },
        {
          field: 'preReadingTime',
          headerAlign: 'center',
          headerName: '上期读表时间',
          width: 180,
          align: 'center'
        },
        {
          field: 'curReadingTime',
          headerAlign: 'center',
          headerName: '本期读表时间',
          width: 180,
          align: 'center'
        },
        {
          field: 'createdAt',
          headerAlign: 'center',
          headerName: '创建时间',
          width: 180,
          align: 'center'
        },
        {
          field: 'actions',
          headerName: '操作',
          type: 'actions',
          width: 150,
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
