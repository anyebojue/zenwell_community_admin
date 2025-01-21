import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { deleteByIds, find } from 'modules/property/venue'
import { VenueReply } from 'api/model/property/venueModel'
import { SpaceReply } from 'api/model/property/spaceModel'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

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

const InfoIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.VenueSlice)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [dialogValue, setDialogValue] = useState<VenueReply>({})
  const [dialogSpaceValue, setDialogSpaceValue] = useState<SpaceReply>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())

  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const transformData = useMemo(() => {
    const transformNode = (node: VenueReply): TreeViewBaseItem => ({
      id: node.id as string,
      label: node.name as string
    })
    return list?.map(transformNode) || []
  }, [list])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    setLoading(true)
    try {
      const res = await dispatch(find({}))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
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
        await dispatch(find({}))
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const findItemById = useCallback((items: VenueReply[], targetId: string): VenueReply | null => {
    for (const item of items) {
      if (item.id === targetId) return item
    }
    return null
  }, [])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonCommonStyle()}
              onClick={() => {
                setOpenDialog(true)
                setDialogType('add')
              }}
            >
              添加
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Edit />}
              sx={buttonCommonStyle()}
              onClick={() => {
                setOpenDialog(true)
                setDialogType('edit')
              }}
            >
              修改
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={buttonCommonStyle()}
              onClick={() => setDelOpen(true)}
            >
              删除
            </Button>
          </Stack>
          <RichTreeView
            items={transformData}
            defaultExpandedItems={['9032183211253301249']}
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
            dialogSpaceValue={dialogSpaceValue}
            setDialogSpaceValue={setDialogSpaceValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </Box>
      </Stack>
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogType={dialogType}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={[dialogValue.name as string]}
        onDelete={() => handleDelete([dialogValue.id as string])}
      />
    </Box>
  )
}

export default memo(InfoIndex)
