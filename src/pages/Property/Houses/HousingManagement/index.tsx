import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import { RoomReply } from 'api/model/property/roomModel'
import { deleteByIds, find } from 'modules/property/housingManagement'
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
  width: '100%'
})

const buttonCommonStyle = (color: string = '#2660ad', height: string = '32px') => ({
  ...buttonStyles(color, '#1d428a'),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

const HousingManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.HousingManagementSlice)
  const [openFloorDialog, setOpenFloorDialog] = useState(false)
  const [openUnitDialog, setOpenUnitDialog] = useState(false)
  const [openRoomDialog, setOpenRoomDialog] = useState(false)
  const [dialogType, setDialogType] = useState('edit')
  const [dialogValue, setDialogValue] = useState<HousingManagementReply>({})
  const [dialogRoomValue, setDialogRoomValue] = useState<RoomReply>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())

  const [openImportRoom, setOpenImportRoom] = useState(false)

  const [delOpen, setDelOpen] = useState(false)
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
    if (!list || list.length === 0) {
      setDialogValue({})
    } else {
      setDialogValue(list[0])
    }
  }, [list])

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

  const findItemById = useCallback(
    (items: HousingManagementReply[], targetId: string): HousingManagementReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.unit?.length) {
          const foundInChildren = findItemById(item.unit, targetId)
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
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, backgroundColor: '#fff', py: 2, px: 2, borderRadius: '10px' }}
      >
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonCommonStyle()}
          onClick={() => {
            setOpenFloorDialog(true)
            setDialogType('add')
          }}
        >
          添加楼栋
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Edit />}
          sx={buttonCommonStyle()}
          onClick={() => {
            if (dialogValue?.unit) {
              setOpenFloorDialog(true)
              setDialogType('edit')
            } else {
              message.warning('请先选择楼栋')
            }
          }}
        >
          修改楼栋
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonCommonStyle()}
          onClick={() => {
            if (dialogValue?.unit) {
              setDelOpen(true)
            } else {
              message.warning('请先选择楼栋')
            }
          }}
        >
          删除楼栋
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonCommonStyle()}
          onClick={() => {
            if (dialogValue?.unit) {
              setOpenUnitDialog(true)
              setDialogType('add')
            } else {
              message.warning('请先选择楼栋')
            }
          }}
        >
          添加单元
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Edit />}
          sx={buttonCommonStyle()}
          onClick={() => {
            if (!dialogValue?.unit) {
              setDialogType('edit')
              setOpenUnitDialog(true)
            } else {
              message.warning('请先选择单元')
            }
          }}
        >
          修改单元
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonCommonStyle()}
          onClick={() => {
            if (!dialogValue?.unit) {
              setDelOpen(true)
            } else {
              message.warning('请先选择单元')
            }
          }}
        >
          删除单元
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonCommonStyle()}
          onClick={() => {
            setDialogType('add')
            setOpenRoomDialog(true)
          }}
        >
          添加房屋
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonCommonStyle()}
          onClick={() => {
            setOpenImportRoom(true)
          }}
        >
          房产导入
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<FileCopy />}
          sx={buttonCommonStyle()}
          onClick={() => {
            setDialogType('add')
          }}
        >
          文档
        </Button>
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
            expansionTrigger="iconContainer" // 只有点击左边的按钮才展开
          />
        </Box>
        <Box sx={{ width: '450%' }}>
          <FormSearch dialogValue={dialogValue} />
          <TableData
            dialogValue={dialogValue}
            dialogRoomValue={dialogRoomValue}
            setDialogRoomValue={setDialogRoomValue}
            setOpenRoomDialog={setOpenRoomDialog}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
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
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={[dialogValue.name || ('小区单元' as string)]}
        onDelete={() => handleDelete([dialogValue.id as string])}
      />
      <ImportRoom openImportRoom={openImportRoom} setOpenImportRoom={setOpenImportRoom} />
    </Box>
  )
}

export default memo(HousingManagementIndex)
