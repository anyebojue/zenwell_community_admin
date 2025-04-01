import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenusReply } from 'api/model/develop/menuModel'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { findMenus } from 'modules/develop/menu'
import { Box, Checkbox } from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import message from 'components/Message'
import { TreeViewBaseItem } from '@mui/x-tree-view'

interface FeatureProps {
  dialogValue: RolesReply
}

const Feature: React.FC<FeatureProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { menus } = useSelector((state: RootState) => state.MenuSlice)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const transformData = useMemo(() => {
    const transformNode = (node: MenusReply): TreeViewBaseItem => {
      return {
        id: node.id as string,
        label: node.name as string,
        children: node.children?.map(transformNode) || []
      }
    }
    return menus?.map(transformNode) || []
  }, [menus])

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

  const getAllChildIds = (node: TreeViewBaseItem): string[] => {
    let ids: string[] = [node.id]
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        ids = [...ids, ...getAllChildIds(child as TreeViewBaseItem)]
      })
    }
    return ids
  }

  const findNodeById = (nodes: TreeViewBaseItem[], id: string): TreeViewBaseItem | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children as TreeViewBaseItem[], id)
        if (found) return found
      }
    }
    return null
  }

  const getDirectChildrenIds = (nodeId: string): string[] => {
    const node = findNodeById(transformData, nodeId)
    if (!node || !node.children || node.children.length === 0) return []

    return (node.children as TreeViewBaseItem[]).map(child => child.id)
  }

  const getChildrenIds = (nodeId: string): string[] => {
    const node = findNodeById(transformData, nodeId)
    if (!node || !node.children || node.children.length === 0) return []
    let childIds: string[] = []
    node.children.forEach(child => {
      childIds = [...childIds, ...getAllChildIds(child as TreeViewBaseItem)]
    })
    return childIds
  }

  const getParentId = (nodeId: string): string | null => {
    const findParent = (
      nodes: TreeViewBaseItem[],
      id: string,
      parent: string | null = null
    ): string | null => {
      for (const node of nodes) {
        if (node.id === id) return parent
        if (node.children && node.children.length > 0) {
          const found = findParent(node.children as TreeViewBaseItem[], id, node.id)
          if (found !== null) return found
        }
      }
      return null
    }
    return findParent(transformData, nodeId)
  }

  const isIndeterminate = (nodeId: string): boolean => {
    const childIds = getChildrenIds(nodeId)
    if (childIds.length === 0) return false
    const selectedChildIds = childIds.filter(id => selectedItems.includes(id))
    return selectedChildIds.length > 0 && selectedChildIds.length < childIds.length
  }

  const handleToggle = (itemId: string) => {
    setSelectedItems(prev => {
      let newSelected = [...prev]
      const childIds = getChildrenIds(itemId)
      if (prev.includes(itemId)) {
        newSelected = prev.filter(id => id !== itemId && !childIds.includes(id))
      } else {
        newSelected = [...prev, itemId, ...childIds.filter(id => !prev.includes(id))]
      }
      const updateParentStatus = (nodeId: string) => {
        const parentId = getParentId(nodeId)
        if (!parentId) return
        const siblingIds = getDirectChildrenIds(parentId)
        const allSiblingsSelected = siblingIds.every(id => newSelected.includes(id))
        if (allSiblingsSelected) {
          if (!newSelected.includes(parentId)) {
            newSelected.push(parentId)
          }
        } else {
          if (newSelected.includes(parentId)) {
            newSelected = newSelected.filter(id => id !== parentId)
          }
        }
        updateParentStatus(parentId)
      }
      updateParentStatus(itemId)
      return newSelected
    })
  }

  const renderTreeItems = (nodes: TreeViewBaseItem[]) => {
    return nodes.map((node: TreeViewBaseItem) => {
      const checked = selectedItems.includes(node.id)
      const indeterminate = !checked && isIndeterminate(node.id)
      return (
        <TreeItem
          key={node.id}
          itemId={node.id}
          label={
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={() => handleToggle(node.id)}
              />
              {node.label}
            </Box>
          }
        >
          {node.children &&
            node.children.length > 0 &&
            renderTreeItems(node.children as TreeViewBaseItem[])}
        </TreeItem>
      )
    })
  }

  return (
    <Box>
      <SimpleTreeView expansionTrigger="iconContainer" multiSelect>
        {renderTreeItems(transformData)}
      </SimpleTreeView>
    </Box>
  )
}

export default memo(Feature)
