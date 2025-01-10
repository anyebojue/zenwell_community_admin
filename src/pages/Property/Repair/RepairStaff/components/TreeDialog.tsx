import { memo, useCallback, useEffect, useState, useMemo, Dispatch, SetStateAction } from 'react'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { find, findOrgUser } from 'modules/platform/organizationInfo'
import { OrganizationInfoReply } from 'api/model/platform/organizationInfoModel'
import { Avatar, Box, Dialog, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { Work } from '@mui/icons-material'

interface TreeDialogProps {
  openTree: boolean
  setOpenTree: Dispatch<SetStateAction<boolean>>
}

const TreeDialog: React.FC<TreeDialogProps> = ({ openTree, setOpenTree }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [dialogValue, setDialogValue] = useState<OrganizationInfoReply>({})

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
    }
  }, [fetchData, openTree])

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

  return (
    <Dialog fullWidth onClose={() => setOpenTree(false)} open={openTree}>
      <Box sx={{ display: 'flex', width: '100%' }}>
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
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {orgUserList.map(item => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar>
                  <Work />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.users?.username} secondary={item.users?.mobile} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  )
}

export default memo(TreeDialog)
