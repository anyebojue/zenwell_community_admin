import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/floor'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Download } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { TreeViewBaseItem } from '@mui/x-tree-view'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findRoom } from 'modules/property/houses/room'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import FormSearch from './components/FormSearch'
import HousingExpenses from './components/HousingExpenses'
import CustomTemplate from './components/CustomTemplate'
import ImportCustomFee from './components/ImportCustomFee'
import BatchCreation from './components/BatchCreation'

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

const buttonCommonStyle = (color: string = '#2660ad', height: string = '32px') => ({
  ...buttonStyles(color, '#1d428a'),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

const HousingManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.FloorSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [dialogValue, setDialogValue] = useState<{
    id?: string
    label?: string
    roomData?: RoomReply
  }>({})

  const [openDialog, setOpenDialog] = useState(false)
  const [payerObjType, setPayerObjType] = useState(1)
  const [floorValue, setFloorValue] = useState('')
  const [unitValue, setUnitValue] = useState('')
  const [roomValue, setRommValue] = useState('')
  const [feeTypeCd, setFeeTypeCd] = useState('')

  const fetchFloorData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findFloor({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  const fetchUnitData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findUnit({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  const fetchRoomData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findRoom({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  useEffect(() => {
    if (payerObjType === 2) {
      fetchFloorData()
    } else if (payerObjType === 3) {
      fetchFloorData()
      if (floorValue) {
        fetchUnitData()
      }
    } else if (payerObjType === 4) {
      fetchFloorData()
      if (unitValue) {
        fetchRoomData()
      }
    }
  }, [fetchFloorData, fetchRoomData, fetchUnitData, floorValue, payerObjType, unitValue])

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
    fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData])

  useEffect(() => {
    if (feeTypeCd) {
      fetchData(
        findFeeConfig,
        { feeTypeCd: feeTypeCd, 'page.disable': true },
        '正在加载列表中，请稍后...'
      )
    }
  }, [feeTypeCd, fetchData])

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
          <Stack
            direction="row"
            spacing={1}
            sx={{
              backgroundColor: '#fff',
              py: 1,
              px: 2,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography component="h6" variant="h6" gutterBottom>
              {dialogValue?.roomData?.unit?.floor?.floorNum} -{' '}
              {dialogValue?.roomData?.unit?.unitNum} - {dialogValue?.roomData?.roomNum}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonCommonStyle()}
                onClick={() => setOpenTemplate(true)}
              >
                自定义模板
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonCommonStyle()}
                onClick={() => setOpenImport(true)}
              >
                自定义导入
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonCommonStyle()}
                onClick={() => setOpenDialog(true)}
              >
                批量创建
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonCommonStyle()}
                onClick={() => {}}
              >
                批量催缴单
              </Button>
            </Stack>
          </Stack>
          <FormSearch />
          <Box sx={contentBoxStyle}>
            <HousingExpenses dialogValue={dialogValue} />
          </Box>
        </Box>
      </Stack>
      <Copyright />

      <CustomTemplate
        dialogValue={dialogValue}
        openDialog={openTemplate}
        setOpenDialog={setOpenTemplate}
      />
      <ImportCustomFee openDialog={openImport} setOpenDialog={setOpenImport} />
      <BatchCreation
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        payerObjType={payerObjType}
        setPayerObjType={setPayerObjType}
        feeTypeCd={feeTypeCd}
        setFeeTypeCd={setFeeTypeCd}
        floorValue={floorValue}
        setFloorValue={setFloorValue}
        unitValue={unitValue}
        setUnitValue={setUnitValue}
        roomValue={roomValue}
        setRommValue={setRommValue}
      />
    </Box>
  )
}

export default memo(HousingManagementIndex)
