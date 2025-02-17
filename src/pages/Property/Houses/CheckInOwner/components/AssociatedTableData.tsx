import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HousingManagementReply } from 'api/model/property/houses/housingManagementModel'
import { find as floorFind } from 'modules/property/houses/housingManagement'
import { find as roomFind } from 'modules/property/houses/room'
import message from 'components/Message'
import { Button } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import { RoomReply } from 'api/model/property/houses/roomModel'
import AssociatedTableList from './AssociatedTableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface AssociatedTableDataProps {
  activeStep: number
  selectfloorValue: HousingManagementReply | undefined
  setSelectRoomValue: Dispatch<SetStateAction<RoomReply | undefined>>
  setSelectFloorValue: Dispatch<SetStateAction<HousingManagementReply | undefined>>
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
  const { page: floorPage, list: floorList } = useSelector(
    (state: RootState) => state.HousingManagementSlice
  )
  const { page: roomPage, list: roomList } = useSelector((state: RootState) => state.RoomSlice)

  const columnsFloor: Column<HousingManagementReply>[] = [
    { key: 'id', headerName: '楼栋ID', align: 'center' },
    { key: 'name', headerName: '楼栋名称', align: 'center' },
    { key: 'name', headerName: '楼栋编号', align: 'center' },
    { key: 'remark', headerName: '备注', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
          onClick={() => {
            setSelectFloorValue(row)
            setAssociatedOpen(false)
          }}
        >
          选择
        </Button>
      )
    }
  ]

  const columnsRoom: Column<RoomReply>[] = [
    { key: 'id', headerName: '房屋ID', align: 'center' },
    {
      key: 'floorId',
      headerName: '楼栋编号',
      align: 'center',
      renderCell: row => `${row.unit?.floor?.name}`
    },
    {
      key: 'unitId',
      headerName: '单元编号',
      align: 'center',
      renderCell: row => `${row.unit?.unitNum}单元`
    },
    { key: 'roomNum', headerName: '房屋编号', align: 'center' },
    { key: 'layer', headerName: '楼层', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: row => (
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={{ ...buttonStyles('#2660ad', '#1d428a') }}
          onClick={() => {
            setSelectRoomValue(row)
            setAssociatedOpen(false)
          }}
        >
          选择
        </Button>
      )
    }
  ]

  const fetchFloorData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        floorFind({ 'page.num': floorPage.num, 'page.size': floorPage.size })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, floorPage.num, floorPage.size])

  const fetchRoomData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        roomFind({
          'page.num': roomPage.num,
          'page.size': roomPage.size,
          floorId: selectfloorValue?.id
        })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, roomPage.num, roomPage.size, selectfloorValue?.id])

  useEffect(() => {
    activeStep === 0 ? fetchFloorData() : fetchRoomData()
  }, [activeStep, fetchFloorData, fetchRoomData])

  return (
    <AssociatedTableList
      rows={activeStep === 0 ? floorList : roomList}
      columns={activeStep === 0 ? columnsFloor : columnsRoom}
    />
  )
}

export default memo(AssociatedTableData)
