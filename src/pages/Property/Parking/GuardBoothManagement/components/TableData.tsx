import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/parking/parkingBox'
import { find as findArea } from 'modules/property/parking/parkingArea'
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { Chip } from '@mui/material'
import { ParkingBoxReply } from 'api/model/property/parking/parkingBoxModel'

interface TableDataProps {
  setDialogValue: Dispatch<SetStateAction<ParkingBoxReply | undefined>>
  setDialogType: Dispatch<SetStateAction<string>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
}

const statusValue: Record<string, string> = {
  Y: '是',
  N: '否'
}

const statusData: Record<string, string> = {
  Y: '可进场',
  N: '不可进场'
}

const TableData: React.FC<TableDataProps> = ({
  setDialogValue,
  setDialogType,
  setOpenDialog,
  setDelOpen,
  setSelectedRows
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ParkingBoxSlice)

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
    fetchData(findArea, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleRowSelection = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      setSelectedRows(new Set(rowSelectionModel.map(id => String(id))))
    },
    [setSelectedRows]
  )

  const handleActionClick = useCallback(
    (actionType: string, row: ParkingBoxReply) => {
      switch (actionType) {
        case 'card':
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
    [setDialogType, setDialogValue, setOpenDialog, setDelOpen, setSelectedRows]
  )

  const renderActionButtons = (row: ParkingBoxReply) => {
    const actions = [
      { title: '控制台', action: 'card' },
      { title: '修改', action: 'edit' },
      { title: '删除', action: 'delete' }
    ]
    return actions.map(({ title, action }) => (
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
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      checkboxSelection
      rows={list}
      columns={[
        { field: 'id', headerName: '岗亭编号', width: 200 },
        { field: 'boxName', headerName: '岗亭名称', flex: 1 },
        { field: 'parkingArea.name', headerName: '停车场', flex: 1 },
        {
          field: 'tempCarIn',
          headerName: '临时车进场',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.tempCarIn!] || '未知'} />
        },
        {
          field: 'fee',
          headerName: '是否收费',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusValue[row.fee!] || '未知'} />
        },
        {
          field: 'blueCarIn',
          headerName: '已在场',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusData[row.blueCarIn!] || '未知'} />
        },
        {
          field: 'yelowCarIn',
          headerName: '未在场',
          flex: 1,
          renderCell: ({ row }) => <Chip label={statusData[row.yelowCarIn!] || '未知'} />
        },
        { field: 'remark', headerName: '备注', flex: 1 },
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
