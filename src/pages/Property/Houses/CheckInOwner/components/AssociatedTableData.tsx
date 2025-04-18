import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FloorReply } from 'api/model/property/houses/floorModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { find as floorFind } from 'modules/property/houses/floor'
import { find as roomFind } from 'modules/property/houses/room'
import { Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'

type CombinedReply = FloorReply | RoomReply

interface AssociatedTableDataProps {
  activeStep: number
  selectfloorValue: FloorReply | undefined
  setSelectRoomValue: Dispatch<SetStateAction<RoomReply | undefined>>
  setSelectFloorValue: Dispatch<SetStateAction<FloorReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AssociatedTableData: React.FC<AssociatedTableDataProps> = ({
  activeStep,
  selectfloorValue,
  setSelectRoomValue,
  setSelectFloorValue,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page: floorPage, list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const { page: roomPage, list: roomList } = useSelector((state: RootState) => state.RoomSlice)

  const columnsFloor: GridColDef<CombinedReply>[] = [
    { field: 'id', headerName: '楼栋ID', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: '楼栋名称', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'floorNum',
      headerName: '楼栋编号',
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'remark', headerName: '备注', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: '操作',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => renderActionButtons(row),
      headerAlign: 'center',
      align: 'center'
    }
  ]

  const columnsRoom: GridColDef<CombinedReply>[] = [
    { field: 'id', headerName: '房屋ID', width: 180, headerAlign: 'center', align: 'center' },
    {
      field: 'floorId',
      headerName: '楼栋编号',
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'unitId', headerName: '单元编号', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'roomNum',
      headerName: '房屋编号',
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'layer', headerName: '楼层', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: '操作',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => renderActionButtons(row),
      headerAlign: 'center',
      align: 'center'
    }
  ]

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
    if (activeStep === 0) {
      fetchData(
        floorFind,
        { 'page.num': floorPage.num, 'page.size': floorPage.size },
        '正在加载列表中，请稍后...'
      )
    } else {
      fetchData(
        roomFind,
        {
          'page.num': floorPage.num,
          'page.size': floorPage.size,
          floorId: String(selectfloorValue?.id)
        },
        '正在加载列表中，请稍后...'
      )
    }
  }, [activeStep, fetchData, floorPage.num, floorPage.size, selectfloorValue?.id])

  const handleActionClick = useCallback(
    (actionType: string, row: FloorReply | RoomReply) => {
      switch (actionType) {
        case 'select':
          if (activeStep === 0) {
            setSelectFloorValue(row as FloorReply)
            setAssociatedOpen(false)
          } else {
            setSelectRoomValue(row as RoomReply)
            setAssociatedOpen(false)
          }
          break
      }
    },
    [activeStep, setAssociatedOpen, setSelectFloorValue, setSelectRoomValue]
  )

  const renderActionButtons = (row: FloorReply | RoomReply) => {
    const actions = [{ title: '选择', action: 'select' }]
    return actions.map(({ title, action }) => (
      <Button
        key={title}
        size="small"
        variant="contained"
        color="error"
        sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
        onClick={() => handleActionClick(action, row)}
      >
        选择
      </Button>
    ))
  }

  return (
    <DataGrid
      sx={{ mt: 1 }}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      disableColumnResize
      disableVirtualization={false}
      rows={activeStep === 0 ? floorList : roomList}
      columns={activeStep === 0 ? columnsFloor : columnsRoom}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      rowCount={Number(activeStep === 0 ? floorPage.total : roomPage.total)}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: Number(activeStep === 0 ? roomPage.size : roomPage.size)
          }
        }
      }}
    />
  )
}

export default memo(AssociatedTableData)
