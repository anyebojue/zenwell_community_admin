import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/feeConfig/meterWater'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findRoom } from 'modules/property/houses/room'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { Add } from '@mui/icons-material'
import { deleteByIds } from 'modules/property/feeConfig/meterWater'
import { MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%',
  marginTop: '15px'
})

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '250px'
})

const HousingManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.MeterWaterSlice)
  const { list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [dialogValue, setDialogValue] = useState<{
    id?: string
    label?: string
    roomData?: RoomReply
  }>({})
  const [dialogMeterWaterValue, setDialogMeterWaterValue] = useState<MeterWaterReply>({})
  const [dialogType, setDialogType] = useState('add')
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const MUI_X_PRODUCTS: TreeViewBaseItem[] = useMemo(() => {
    return floorList.map(item => ({
      id: `${item.id}`,
      label: `${item.name}`,
      children: item.unit?.map(unit => {
        const roomsForUnit = roomList.filter(room => room.unitId === unit.id)
        const unitWithRooms = {
          id: `${unit.id}`,
          label: `${unit.unitNum}单元`,
          children: roomsForUnit.map(room => ({
            id: `${room.id}`,
            label: `${room.roomNum}`,
            roomData: room
          }))
        }
        return unitWithRooms
      })
    }))
  }, [floorList, roomList])

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
    fetchData(findFloor, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findRoom, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData])

  useEffect(() => {
    if (!MUI_X_PRODUCTS || MUI_X_PRODUCTS.length === 0) {
      setDialogValue({})
    } else {
      setDialogValue(MUI_X_PRODUCTS[0]?.children?.[0]?.children?.[0] || {})
    }
  }, [MUI_X_PRODUCTS])

  const findItemById = useCallback(
    (
      items: TreeViewBaseItem[],
      targetId: string
    ): {
      id: string
      label: string
      roomData?: RoomReply
      children?: TreeViewBaseItem[]
    } | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    []
  )

  const getDeleteData = useCallback(() => {
    return Array.from(selectedRows)
      .map(id => list.find(item => item.id === id))
      .filter(item => item)
      .map(item => ({ id: item!.id! }))
  }, [selectedRows, list])

  const deleteData = getDeleteData()
  const deleteIds = deleteData.map(item => item.id)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            defaultExpandedItems={[
              MUI_X_PRODUCTS[0]?.id,
              MUI_X_PRODUCTS[0]?.children?.[0]?.id as string
            ]}
            selectedItems={dialogValue?.id}
            onSelectedItemsChange={(_, selectedItemId) => {
              if (!selectedItemId) return
              const selectedItem = findItemById(MUI_X_PRODUCTS, selectedItemId)
              if (selectedItem && selectedItem.roomData) {
                setDialogValue(selectedItem)
              }
            }}
            expansionTrigger="iconContainer"
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <FormSearch selectedRows={selectedRows} setDelOpen={setDelOpen} />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">{dialogValue.label} 房屋抄表信息</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('add')
                  }}
                >
                  抄表
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('code')
                  }}
                >
                  二维码抄表
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('one')
                  }}
                >
                  抄表导入1
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('two')
                  }}
                >
                  抄表导入2
                </Button>
              </Stack>
            </Box>
            <TableData
              dialogValue={dialogValue}
              setDialogMeterWaterValue={setDialogMeterWaterValue}
              setSelectedRows={setSelectedRows}
              setOpenDialog={setOpenDialog}
              setDialogType={setDialogType}
              setDelOpen={setDelOpen}
            />
          </Box>
        </Box>
      </Stack>
      <Copyright />

      <FormDialog
        dialogValue={dialogValue}
        dialogMeterWaterValue={dialogMeterWaterValue}
        openDialog={openDialog}
        dialogType={dialogType}
        setOpenDialog={setOpenDialog}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteIds}
        onDelete={() => handleDelete(deleteIds)}
      />
    </Box>
  )
}

export default memo(HousingManagementIndex)
