import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/floor'
import { find as findRoom } from 'modules/property/houses/room'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { deleteByIds } from 'modules/property/feeConfig/feeCollectionOrder'
import { FeeCollectionOrderReply } from 'api/model/property/feeConfig/feeCollectionOrderModel'
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
  const { page, list } = useSelector((state: RootState) => state.FloorSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [dialogValue, setDialogValue] = useState<{
    id?: string
    label?: string
    roomData?: RoomReply
  }>({})
  const [dialogMeterWaterValue, setDialogMeterWaterValue] = useState<FeeCollectionOrderReply>({})
  const [dialogType, setDialogType] = useState('sign')
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const MUI_X_PRODUCTS: TreeViewBaseItem[] = useMemo(() => {
    return list.map(item => ({
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
  }, [list, roomList])

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
    fetchData(find, { 'page.disable': true }, '正在加载列表中，请稍后...')
    fetchData(findRoom, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData, page.disable, page.num, page.size])

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
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.name! }))
        .filter(item => item.id && item.name)
    }
    if (dialogMeterWaterValue) {
      return dialogMeterWaterValue.id && dialogMeterWaterValue.name
        ? [{ id: dialogMeterWaterValue.id, name: dialogMeterWaterValue.name }]
        : []
    }
    return []
  }, [selectedRows, list, dialogMeterWaterValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

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
        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
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
              MUI_X_PRODUCTS[0]?.id || '9031315219250413569',
              MUI_X_PRODUCTS[0]?.children?.[0]?.id || '9031315219267190785'
            ]}
            selectedItems={dialogValue?.id || '9031315219283968001'}
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
          <FormSearch />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">催缴记录</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('sign')
                  }}
                >
                  登记
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('payment')
                  }}
                >
                  催缴
                </Button>
              </Stack>
            </Box>
            <TableData
              dialogValue={dialogValue}
              setDialogMeterWaterValue={setDialogMeterWaterValue}
              setSelectedRows={setSelectedRows}
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
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
    </Box>
  )
}

export default memo(HousingManagementIndex)
