import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FloorReply } from 'api/model/property/houses/floorModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { deleteByIds as deleteByIdsFloor, find } from 'modules/property/houses/floor'
import { deleteByIds as deleteByIdsUnit } from 'modules/property/houses/unit'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme } from '@mui/material'
import { Add, Delete, Edit, FileCopy } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FloorFormDialog from './components/FloorFormDialog'
import UnitFormDialog from './components/UnitFormDialog'
import RoomFormDialog from './components/RoomFormDialog'
import ImportRoom from './components/ImportRoom'

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

const DIALOGS = {
  FLOOR: 'floor',
  UNIT: 'unit',
  ROOM: 'room'
}

const ACTIONS = {
  ADD: 'add',
  EDIT: 'edit'
}

const FloorIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.FloorSlice)
  const [openFloorDialog, setOpenFloorDialog] = useState(false)
  const [openUnitDialog, setOpenUnitDialog] = useState(false)
  const [openRoomDialog, setOpenRoomDialog] = useState(false)
  const [dialogType, setDialogType] = useState(ACTIONS.EDIT)
  const [dialogValue, setDialogValue] = useState<FloorReply>({})
  const [dialogRoomValue, setDialogRoomValue] = useState<RoomReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [delRoomOpen, setDelRoomOpen] = useState(false)
  const [openImportRoom, setOpenImportRoom] = useState(false)
  const [delFloorOpen, setDelFloorOpen] = useState(false)
  const [delUnitOpen, setDelUnitOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const MUI_X_PRODUCTS = useMemo(() => {
    return list.map(item => ({
      id: item.id,
      label: item.name,
      children: item.unit?.map(unit => ({
        id: unit.id,
        label: `${unit.unitNum}单元`
      }))
    }))
  }, [list])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    setLoading(true)
    try {
      const res = await dispatch(find({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setDialogValue(list.length ? list[0] : {})
  }, [list])

  const handleDelete = useCallback(
    async (ids: string[], isFloor: boolean) => {
      setLoading(true)
      try {
        const deleteFn = isFloor ? deleteByIdsFloor : deleteByIdsUnit
        const res = await dispatch(deleteFn(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        isFloor ? setDelFloorOpen(false) : setDelUnitOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.disable': true }))
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const findItemById = useCallback((items: FloorReply[], targetId: string): FloorReply | null => {
    for (const item of items) {
      if (item.id === targetId) return item
      if (item.unit?.length) {
        const foundInChildren = findItemById(item.unit, targetId)
        if (foundInChildren) return foundInChildren
      }
    }
    return null
  }, [])

  const handleDialogOpen = (dialog: string, type: string) => {
    switch (dialog) {
      case DIALOGS.FLOOR:
        setOpenFloorDialog(true)
        break
      case DIALOGS.UNIT:
        setOpenUnitDialog(true)
        break
      case DIALOGS.ROOM:
        setOpenRoomDialog(true)
        break
      default:
        break
    }
    setDialogType(type)
  }

  const renderButtons = () => {
    const buttons = [
      {
        label: '添加楼栋',
        icon: <Add />,
        onClick: () => handleDialogOpen(DIALOGS.FLOOR, ACTIONS.ADD),
        condition: true
      },
      {
        label: '修改楼栋',
        icon: <Edit />,
        onClick: () =>
          dialogValue?.floorNum
            ? handleDialogOpen(DIALOGS.FLOOR, ACTIONS.EDIT)
            : message.warning('请先选择楼栋'),
        condition: dialogValue?.floorNum
      },
      {
        label: '删除楼栋',
        icon: <Delete />,
        onClick: () =>
          dialogValue?.unit ? setDelFloorOpen(true) : message.warning('请先选择楼栋'),
        condition: dialogValue?.unit
      },
      {
        label: '添加单元',
        icon: <Add />,
        onClick: () =>
          dialogValue?.unit
            ? handleDialogOpen(DIALOGS.UNIT, ACTIONS.ADD)
            : message.warning('请先选择楼栋'),
        condition: dialogValue?.unit
      },
      {
        label: '修改单元',
        icon: <Edit />,
        onClick: () =>
          !dialogValue?.unit
            ? handleDialogOpen(DIALOGS.UNIT, ACTIONS.EDIT)
            : message.warning('请先选择单元'),
        condition: !dialogValue?.unit
      },
      {
        label: '删除单元',
        icon: <Delete />,
        onClick: () =>
          !dialogValue?.unit ? setDelUnitOpen(true) : message.warning('请先选择单元'),
        condition: !dialogValue?.unit
      },
      {
        label: '添加房屋',
        icon: <Add />,
        onClick: () => {
          setDialogType(ACTIONS.ADD)
          setOpenRoomDialog(true)
        },
        condition: true
      },
      {
        label: '房产导入',
        icon: <Add />,
        onClick: () => setOpenImportRoom(true),
        condition: true
      },
      {
        label: '文档',
        icon: <FileCopy />,
        onClick: () => setDialogType(ACTIONS.ADD),
        condition: true
      }
    ]

    return buttons.map(({ label, icon, onClick, condition }) => {
      if (condition) {
        return (
          <Button
            key={label}
            size="small"
            variant="contained"
            color="error"
            startIcon={icon}
            sx={buttonCommonStyle()}
            onClick={onClick}
          >
            {label}
          </Button>
        )
      }
      return null
    })
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, backgroundColor: '#fff', py: 2, px: 2, borderRadius: '10px' }}
      >
        {renderButtons()}
      </Stack>
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            defaultExpandedItems={['9030190676301578241']}
            selectedItems={dialogValue?.id || ''}
            onSelectedItemsChange={(_, selectedItemId) => {
              if (!selectedItemId) return
              const item = findItemById(list, selectedItemId)
              if (item) setDialogValue(item)
            }}
            expansionTrigger="iconContainer"
          />
        </Box>
        <Box sx={{ width: '100%', height: '100%' }}>
          <FormSearch
            dialogValue={dialogValue}
            selectedRows={selectedRows}
            setDelRoomOpen={setDelRoomOpen}
          />
          <TableData
            dialogValue={dialogValue}
            dialogRoomValue={dialogRoomValue}
            setDialogRoomValue={setDialogRoomValue}
            setOpenRoomDialog={setOpenRoomDialog}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            delRoomOpen={delRoomOpen}
            setDelRoomOpen={setDelRoomOpen}
          />
        </Box>
      </Stack>
      <Copyright />
      <FloorFormDialog
        dialogValue={dialogValue}
        openFloorDialog={openFloorDialog}
        setOpenFloorDialog={setOpenFloorDialog}
        dialogType={dialogType}
      />
      <UnitFormDialog
        dialogValue={dialogValue}
        openUnitDialog={openUnitDialog}
        setOpenUnitDialog={setOpenUnitDialog}
        dialogType={dialogType}
      />
      <RoomFormDialog
        dialogValue={dialogValue}
        dialogRoomValue={dialogRoomValue}
        openRoomDialog={openRoomDialog}
        setOpenRoomDialog={setOpenRoomDialog}
        dialogType={dialogType}
      />
      <DeleteModal
        loading={loading}
        delOpen={delFloorOpen || delUnitOpen}
        setDelOpen={setDelFloorOpen || setDelUnitOpen}
        userName={[dialogValue.name || '小区单元']}
        onDelete={() => handleDelete([dialogValue.id as string], dialogValue.unit === null)}
      />
      <ImportRoom openImportRoom={openImportRoom} setOpenImportRoom={setOpenImportRoom} />
    </Box>
  )
}

export default memo(FloorIndex)
