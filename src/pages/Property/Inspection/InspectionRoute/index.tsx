import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteByIds, find } from 'modules/property/spectionRoute'
import { RichTreeView } from '@mui/x-tree-view'
import Grid from '@mui/material/Grid2'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Stack,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
  useTheme
} from '@mui/material'
import { Add, Search } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { SpectionRouteReply } from 'api/model/property/spectionRouteModel'
import AMapExample from 'components/AMapExample'
import FormDialog from './components/FormDialog'
import PlanIndex from './components/PlanIndex'
import TaskIndex from './components/TaskIndex'
import PointIndex from './components/PointIndex'

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

const SpectionRouteIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionRouteSlice)
  const theme = useTheme()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const MUI_X_PRODUCTS = list.map(item => ({ id: item.id, label: item.name }))
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [dialogValue, setDialogValue] = useState<SpectionRouteReply>({})
  const [location, setLoading] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      setLoading(false)
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

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
        fetchData()
        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, fetchData]
  )

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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl sx={{ width: { xs: '100%', md: '15ch' } }} variant="outlined">
              <TextField size="small" label="请输入巡检项目" type="text" variant="outlined" />
            </FormControl>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Search />}
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
            >
              查询
            </Button>
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
          </Stack>
          <RichTreeView
            items={MUI_X_PRODUCTS}
            selectedItems={dialogValue?.id || ''}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">巡检路线</Typography>
              <Box>
                <Button
                  variant="text"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('edit')
                  }}
                >
                  修改
                </Button>
                <Button
                  variant="text"
                  size="small"
                  color="secondary"
                  onClick={() => setDelOpen(true)}
                >
                  删除
                </Button>
              </Box>
            </Box>
            <Divider sx={{ p: 0.5, mb: 2 }} />
            <Box sx={{ pb: 0.2 }}>
              <Grid container spacing={2}>
                {[
                  { label: '巡检路线', value: dialogValue.name },
                  { label: '顺序', value: dialogValue.seq },
                  { label: '创建时间', value: dialogValue.createdAt },
                  { label: '备注', value: dialogValue.remark }
                ].map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Typography variant="body2">
                      {item.label}：{item.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          <Box sx={{ ...contentBoxStyle(theme), marginTop: '10px' }}>
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
              <Tab sx={{ pl: 2, pr: 2 }} label="巡检点" value={0} />
              <Tab sx={{ pl: 2, pr: 2 }} label="巡检地图" value={1} />
              <Tab sx={{ pl: 2, pr: 2 }} label="巡检计划" value={2} />
              <Tab sx={{ pl: 2, pr: 2 }} label="巡检任务" value={3} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {activeTabIndex === 0 && <PointIndex routeDialogValue={dialogValue} />}
              {activeTabIndex === 1 && <AMapExample mapHeight="500px" />}
              {activeTabIndex === 2 && <PlanIndex routeDialogValue={dialogValue} />}
              {activeTabIndex === 3 && <TaskIndex routeDialogValue={dialogValue} />}
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

export default memo(SpectionRouteIndex)
