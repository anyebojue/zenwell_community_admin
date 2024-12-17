import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Delete, Edit, FileCopy } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { deleteByIds, find } from 'modules/platform/organizationInfo'
import { OrganizationInfoReply, OrgUserReply } from 'api/model/platform/organizationInfoModel'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'
import Associated from './components/Associated'

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const contentBoxStyle = (theme: Theme) => ({
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
  const { list } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [dialogValue, setDialogValue] = useState<OrganizationInfoReply>({})
  const [dialogUserValue, setDialogUserValue] = useState<OrgUserReply>({})
  const [dialogEmployessValue, setDialogEmployessValue] = useState<EmployeesReply | undefined>()

  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const transformData = useMemo(() => {
    const transformNode = (node: OrganizationInfoReply): TreeViewBaseItem => ({
      id: node.id as string,
      label: node.name as string,
      children: node.children?.length ? node.children.map(transformNode) : []
    })
    return list?.map(transformNode) || []
  }, [list])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    setLoading(true)
    try {
      await dispatch(find({ pId: '0' }))
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
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
        await dispatch(deleteByIds(ids))
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ pId: '0' }))
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const findItemById = useCallback(
    (items: OrganizationInfoReply[], targetId: string): OrganizationInfoReply | null => {
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
            defaultExpandedItems={['9027438861059358721']}
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
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">{dialogValue.name} 员工</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<FileCopy />}
                  sx={buttonCommonStyle()}
                >
                  文档
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Add />}
                  sx={buttonCommonStyle()}
                  onClick={() => setAssociatedOpen(true)}
                >
                  关联员工
                </Button>
              </Stack>
            </Box>
            <TableData
              dialogValue={dialogValue}
              dialogUserValue={dialogUserValue}
              setDialogUserValue={setDialogUserValue}
            />
          </Box>
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
      <Associated
        dialogValue={dialogValue}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
        dialogEmployessValue={dialogEmployessValue}
        setDialogEmployessValue={setDialogEmployessValue}
      />
    </Box>
  )
}

export default memo(InfoIndex)
