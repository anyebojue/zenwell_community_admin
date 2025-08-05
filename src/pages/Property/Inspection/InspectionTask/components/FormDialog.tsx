import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SpectionTaskParams,
  SpectionTaskReply
} from 'api/model/property/inspection/spectionTaskModel'
import { find, update } from 'modules/property/inspection/spectionTask'
import {
  Box,
  CircularProgress,
  FormLabel,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  Divider,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { RichTreeView, TreeViewBaseItem } from '@mui/x-tree-view'
import { Work } from '@mui/icons-material'
import { find as treeFind, findOrgUser } from 'modules/platform/organization/organizationInfo'
import { OrganizationInfoReply } from 'api/model/platform/organization/organizationInfoModel'

interface FormDialogProps {
  selectedButton: string
  dialogValue?: SpectionTaskReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [dialogUserValue, setDialogUserValue] = useState<OrganizationInfoReply>({})

  const [formData, setFormData] = useState<SpectionTaskParams>({
    planUserId: '',
    planUserName: '',
    transferDesc: ''
  })

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

  const transformData = useMemo(() => {
    const transformNode = (node: OrganizationInfoReply): TreeViewBaseItem => ({
      id: node.id as string,
      label: node.name as string,
      children: node.children?.length ? node.children.map(transformNode) : []
    })
    return list?.map(transformNode) || []
  }, [list])

  const findItemById = useCallback(
    (items: OrganizationInfoReply[], targetId: string): OrganizationInfoReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
          fetchData(
            findOrgUser,
            { 'page.disable': true, orgId: foundInChildren?.id || '' },
            '正在加载列表中，请稍后...'
          )
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    [fetchData]
  )

  useEffect(() => {
    if (openDialog) {
      fetchData(treeFind, { pId: '0' }, '正在加载列表中，请稍后...')
      fetchData(
        findOrgUser,
        { 'page.disable': true, orgId: '9032183211253301249' },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, openDialog])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = {
          ...formData,
          originalPlanUserId: dialogValue?.planUserId,
          originalPlanUserName: dialogValue?.planUserName
        }
        console.log(params)
        const action = update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('流转成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      formData,
      dialogValue?.planUserId,
      dialogValue?.planUserName,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      setOpenDialog
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box>
            <Typography sx={{ pb: 3 }}>流转对象：</Typography>
            <Box sx={{ display: 'flex' }}>
              <RichTreeView
                sx={{ width: '600px', mr: 2 }}
                items={transformData}
                defaultExpandedItems={['9032183211253301249']}
                selectedItems={dialogUserValue?.id ?? ''}
                onSelectedItemsChange={(_, selectedItemId) => {
                  if (!selectedItemId) return
                  const item = findItemById(list, selectedItemId)
                  if (item) setDialogUserValue(item)
                }}
                expansionTrigger="iconContainer" // 只有点击左边的按钮才展开
              />
              <Divider orientation="vertical" flexItem />
              <List sx={{ ml: 2, width: '100%', bgcolor: 'background.paper' }}>
                {orgUserList.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: 'gray' }}>暂无数据</Typography>
                ) : (
                  orgUserList.map(item => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => {
                        setSelectedUserId(item.id!)
                        setFormData({
                          ...formData,
                          planUserId: item.users?.id,
                          planUserName: item.users?.username
                        })
                      }}
                      sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: 'rgba(0, 0, 0, 0.08)'
                        },
                        backgroundColor:
                          selectedUserId === item.id ? 'rgba(0, 0, 0, 0.12)' : 'transparent', // 根据选中状态改变背景色
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)' // 选中时的高亮背景色
                        }
                      }}
                      selected={selectedUserId === item.id} // 控制选中状态
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <Work />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.users?.username} secondary={item.users?.mobile} />
                    </ListItemButton>
                  ))
                )}
              </List>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>流转说明：</FormLabel>
            <TextField
              placeholder="请输入"
              sx={{ width: '80%' }}
              size="small"
              value={formData.transferDesc}
              onChange={e => setFormData({ ...formData, transferDesc: e.target.value })}
              variant="outlined"
              multiline
              rows={2}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenDialog(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(FormDialog)
