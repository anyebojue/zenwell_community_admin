import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteByIds, find } from 'modules/platform/roles'
import { RichTreeView } from '@mui/x-tree-view'
import { Box, Button, Divider, Stack, Tab, Tabs, Theme, Typography } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RolesReply } from 'api/model/platform/rolesModel'
import Feature from './components/Feature'
import Accredit from './components/Accredit'
import Relevance from './components/Relevance'
import FormDialog from './components/FormDialog'

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

const RolesIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RolesSlice)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const MUI_X_PRODUCTS = list.map(item => ({ id: item.id, label: item.name }))
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [dialogValue, setDialogValue] = useState<RolesReply>({})
  const [location, setLoading] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        await dispatch(deleteByIds(ids))
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
        setLoading(false)
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      setLoading(false)
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
      setLoading(false)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

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
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
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
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
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
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
              onClick={() => setDelOpen(true)}
            >
              删除
            </Button>
          </Stack>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            onSelectedItemsChange={(_, itemId) => {
              const data = list.filter(item => item.id === itemId)
              if (data.length > 0) {
                setDialogValue(data[0])
              }
            }}
          />
        </Box>
        <Box sx={{ width: '450%' }}>
          <Box sx={contentBoxStyle}>
            <Typography variant="h6">管理员角色</Typography>
            <Divider sx={{ p: 0.5, mb: 2 }} />
            <Tabs
              sx={{
                border: 'none',
                boxShadow: 'none',
                '& .MuiTab-root': {
                  border: 'none',
                  boxShadow: 'none'
                },
                '& .MuiTab-root:hover': {
                  border: 'none',
                  boxShadow: 'none'
                }
              }}
              value={activeTabIndex}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab sx={{ pl: 2, pr: 2 }} label="功能授权" value={0} />
              <Tab sx={{ pl: 2, pr: 2 }} label="小区授权" value={1} />
              <Tab sx={{ pl: 2, pr: 2 }} label="员工关联" value={2} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {activeTabIndex === 0 && <Feature />}
              {activeTabIndex === 1 && <Accredit />}
              {activeTabIndex === 2 && <Relevance />}
            </Box>
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
        loading={location}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={[dialogValue.name as string]}
        onDelete={() => handleDelete([dialogValue.id as string])}
      />
    </Box>
  )
}

export default memo(RolesIndex)
