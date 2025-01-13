import { memo, useCallback, useEffect, useState, useMemo, Dispatch, SetStateAction } from 'react'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { find, findOrgUser } from 'modules/platform/organizationInfo'
import { OrganizationInfoReply } from 'api/model/platform/organizationInfoModel'
import {
  Avatar,
  Box,
  Dialog,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material'
import { Work } from '@mui/icons-material'

interface TreeDialogProps {
  openTree: boolean
  setOpenTree: Dispatch<SetStateAction<boolean>>
}

const TreeDialog: React.FC<TreeDialogProps> = ({ openTree, setOpenTree }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [dialogValue, setDialogValue] = useState<OrganizationInfoReply>({})
  const [selectedIndex, setSelectedIndex] = useState('')

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
    try {
      const res = await dispatch(find({ 'page.disable': true, pId: '0' }))
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

  const fetchOrgUserData = useCallback(
    async (id: string) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(findOrgUser({ 'page.disable': true, orgId: id }))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        closeLoading()
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (openTree) {
      fetchData()
      fetchOrgUserData('9032183211253301249')
    }
  }, [fetchData, fetchOrgUserData, openTree])

  useEffect(() => {
    if (!list || list.length === 0) {
      setDialogValue({})
    } else {
      setDialogValue(list[0])
    }
  }, [list])

  const findItemById = useCallback(
    (items: OrganizationInfoReply[], targetId: string): OrganizationInfoReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
          fetchOrgUserData(foundInChildren?.id || '')
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    [fetchOrgUserData]
  )

  const handleListItemClick = (index: string) => {
    setSelectedIndex(index)
  }

  return (
    <Dialog fullWidth onClose={() => setOpenTree(false)} open={openTree}>
      <Box sx={{ display: 'flex', p: 2 }}>
        <RichTreeView
          sx={{ width: '300px', mr: 2 }}
          items={transformData}
          defaultExpandedItems={['9032183211253301249']}
          selectedItems={dialogValue?.id ?? ''}
          onSelectedItemsChange={(_, selectedItemId) => {
            if (!selectedItemId) return
            const item = findItemById(list, selectedItemId)
            if (item) setDialogValue(item)
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
                selected={selectedIndex === item.id}
                onClick={() => handleListItemClick(item.id!)}
                sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
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
    </Dialog>
  )
}

export default memo(TreeDialog)
