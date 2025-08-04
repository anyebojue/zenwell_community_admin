import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Divider, Stack, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { buttonStyles } from 'components/DeleteModal'
import { Close } from '@mui/icons-material'
import { findMenus } from 'modules/develop/menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { RichTreeView, TreeViewBaseItem, useTreeViewApiRef } from '@mui/x-tree-view'
import { MenusReply } from 'api/model/develop/menuModel'
import message from 'components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormDialog from '../Employees/components/FormDialog'
import ResetPassword from '../Employees/components/ResetPassword'

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const getItemDescendantsIds = (item: TreeViewBaseItem) => {
  const ids: string[] = []
  item.children?.forEach(child => {
    ids.push(child.id)
    ids.push(...getItemDescendantsIds(child))
  })

  return ids
}

const CheckOut: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { menus } = useSelector((state: RootState) => state.MenuSlice)
  console.log(menus)
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state?.value
  const theme = useTheme()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const apiRef = useTreeViewApiRef()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({})

  const renameNameToLabel = (obj: MenusReply[]): MenusReply[] => {
    return obj.map(({ name, children, ...rest }) => ({
      label: name,
      children: children ? renameNameToLabel(children) : undefined,
      ...rest
    }))
  }

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findMenus({ pId: '0' }))
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
    fetchData()
  }, [fetchData])

  const transformedList: MenusReply[] = Array.isArray(menus) ? renameNameToLabel(menus) : []

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    toggledItemRef.current[itemId] = isSelected
  }

  const handleSelectedItemsChange = (event: React.SyntheticEvent, newSelectedItems: string[]) => {
    setSelectedItems(newSelectedItems)
    const itemsToSelect: string[] = []
    const itemsToUnSelect: { [itemId: string]: boolean } = {}
    Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
      const item = apiRef.current!.getItem(itemId)
      if (isSelected) {
        itemsToSelect.push(...getItemDescendantsIds(item))
      } else {
        getItemDescendantsIds(item).forEach(descendantId => {
          itemsToUnSelect[descendantId] = true
        })
      }
    })
    const newSelectedItemsWithChildren = Array.from(
      new Set([...newSelectedItems, ...itemsToSelect].filter(itemId => !itemsToUnSelect[itemId]))
    )
    setSelectedItems(newSelectedItemsWithChildren)
    toggledItemRef.current = {}
  }

  return (
    <Box>
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">员工信息</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              修改
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setPasswordOpen(true)}
            >
              重置密码
            </Button>
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: '1px solid #e7eaec' }}>
          <Box>
            <img
              style={{ width: '200px', height: '100%' }}
              src="http://demo.homecommunity.cn/img/noPhoto.jpg"
              alt="Zenwell Logo"
            />
          </Box>
          <Box sx={{ ml: 7, width: '100%' }}>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 1, sm: 1, md: 12 }}>
              {[
                { label: '编号', value: data?.id },
                { label: '名称', value: data?.username },
                { label: '邮箱', value: data?.email },
                { label: '手机', value: data?.mobile },
                { label: '性别', value: data?.sex },
                { label: '住址', value: data?.address }
              ].map((item, index) => (
                <Grid key={index} size={{ md: 4 }} sx={{ my: 1 }}>
                  <Box>
                    {item.label}：{item.value}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
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
          <Tab sx={{ pl: 2, pr: 2 }} label="组织权限" value={0} />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTabIndex === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ width: '80%' }}>
                <Box sx={contentBoxStyle}>
                  <Typography sx={{ pb: 1 }} variant="h6">
                    关联组织
                  </Typography>
                  <Divider />
                  <Box>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                      {[
                        { label: '组织', value: data?.org ? data?.org[0]?.name : '' },
                        { label: '岗位', value: data?.position }
                      ].map((item, index) => (
                        <Grid key={index} size={{ md: 4 }} sx={{ my: 1 }}>
                          <Box>
                            {item.label}：{item.value}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                <Box sx={contentBoxStyle}>
                  <Typography sx={{ pb: 1 }} variant="h6">
                    关联角色及小区
                  </Typography>
                  <Divider />
                  <Box>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                      {data?.role?.name}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 400,
                  overflow: 'auto'
                }}
              >
                <Typography variant="h6">员工权限</Typography>
                <RichTreeView
                  multiSelect
                  checkboxSelection
                  apiRef={apiRef}
                  items={transformedList}
                  selectedItems={selectedItems}
                  onSelectedItemsChange={handleSelectedItemsChange}
                  onItemSelectionToggle={handleItemSelectionToggle}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <FormDialog
        dialogValue={data}
        openDialog={openDialog}
        dialogType="edit"
        setOpenDialog={setOpenDialog}
      />
      <ResetPassword
        dialogValue={data}
        passwordOpen={passwordOpen}
        setPasswordOpen={setPasswordOpen}
      />
    </Box>
  )
}

export default memo(CheckOut)
