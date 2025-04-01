import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenusReply } from 'api/model/develop/menuModel'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { findMenus } from 'modules/develop/menu'
import { update } from 'modules/platform/organization/roles'
import { Box, Checkbox } from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import message from 'components/Message'
import { TreeViewBaseItem } from '@mui/x-tree-view'

interface CustomTreeViewItem extends TreeViewBaseItem {
  code?: string
}

interface FeatureProps {
  dialogValue: RolesReply
}

const Feature: React.FC<FeatureProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { menus } = useSelector((state: RootState) => state.MenuSlice)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const checkboxId = dialogValue.actions?.map(item => item.code)
  const [initialized, setInitialized] = useState(false)

  const transformData = useMemo(() => {
    const transformNode = (node: MenusReply): CustomTreeViewItem => {
      return {
        id: node.id as string,
        label: node.name as string,
        code: node.code,
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

  const getAllChildIds = useCallback((node: CustomTreeViewItem): string[] => {
    let ids: string[] = [node.id]
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        ids = [...ids, ...getAllChildIds(child as CustomTreeViewItem)]
      })
    }
    return ids
  }, [])

  const findNodeById = useCallback(
    (nodes: CustomTreeViewItem[], id: string): CustomTreeViewItem | null => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children && node.children.length > 0) {
          const found = findNodeById(node.children as CustomTreeViewItem[], id)
          if (found) return found
        }
      }
      return null
    },
    []
  )

  const getDirectChildrenIds = useCallback(
    (nodeId: string): string[] => {
      const node = findNodeById(transformData, nodeId)
      if (!node || !node.children || node.children.length === 0) return []

      return (node.children as CustomTreeViewItem[]).map(child => child.id)
    },
    [findNodeById, transformData]
  )

  const getChildrenIds = (nodeId: string): string[] => {
    const node = findNodeById(transformData, nodeId)
    if (!node || !node.children || node.children.length === 0) return []
    let childIds: string[] = []
    node.children.forEach(child => {
      childIds = [...childIds, ...getAllChildIds(child as CustomTreeViewItem)]
    })
    return childIds
  }

  const getParentId = useCallback(
    (nodeId: string): string | null => {
      const findParent = (
        nodes: CustomTreeViewItem[],
        id: string,
        parent: string | null = null
      ): string | null => {
        for (const node of nodes) {
          if (node.id === id) return parent
          if (node.children && node.children.length > 0) {
            const found = findParent(node.children as CustomTreeViewItem[], id, node.id)
            if (found !== null) return found
          }
        }
        return null
      }
      return findParent(transformData, nodeId)
    },
    [transformData]
  )

  const isIndeterminate = (nodeId: string): boolean => {
    const childIds = getChildrenIds(nodeId)
    if (childIds.length === 0) return false
    const selectedChildIds = childIds.filter(id => selectedItems.includes(id))
    return selectedChildIds.length > 0 && selectedChildIds.length < childIds.length
  }

  const getSelectedLeafNodesCodes = (currentSelectedItems?: string[]): string[] => {
    const findLeafNodes = (nodes: CustomTreeViewItem[]): CustomTreeViewItem[] => {
      let leafNodes: CustomTreeViewItem[] = []
      nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
          leafNodes.push(node)
        } else {
          leafNodes = [...leafNodes, ...findLeafNodes(node.children as CustomTreeViewItem[])]
        }
      })
      return leafNodes
    }
    const allLeafNodes = findLeafNodes(transformData)
    const itemsToCheck = currentSelectedItems || selectedItems
    const selectedLeafNodes = allLeafNodes.filter(node => itemsToCheck.includes(node.id))
    return selectedLeafNodes.map(node => node.code || '').filter(Boolean)
  }

  const handleToggle = async (itemId: string) => {
    let newSelectedItemsValue: string[] = []

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
      newSelectedItemsValue = [...newSelected]
      return newSelected
    })
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    const selectedCodes = getSelectedLeafNodesCodes(newSelectedItemsValue)
    const params = {
      id: dialogValue.id,
      name: dialogValue.name,
      word: dialogValue.word,
      action: selectedCodes.join(','),
      plate: dialogValue.plate,
      communityId: dialogValue.communityId,
      users: dialogValue.users ? dialogValue.users[0].id : ''
    }
    try {
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  const findNodeByCode = useCallback(
    (nodes: CustomTreeViewItem[], code: string): CustomTreeViewItem | null => {
      for (const node of nodes) {
        if (node.code === code) return node
        if (node.children && node.children.length > 0) {
          const found = findNodeByCode(node.children as CustomTreeViewItem[], code)
          if (found) return found
        }
      }
      return null
    },
    []
  )

  useEffect(() => {
    if (!checkboxId || !transformData.length) return
    const newSelectedItems: string[] = []
    const findNodeByCodeInline = (
      nodes: CustomTreeViewItem[],
      code: string
    ): CustomTreeViewItem | null => {
      for (const node of nodes) {
        if (node.code === code) return node
        if (node.children && node.children.length > 0) {
          const found = findNodeByCodeInline(node.children as CustomTreeViewItem[], code)
          if (found) return found
        }
      }
      return null
    }

    const getAllChildIdsInline = (node: CustomTreeViewItem): string[] => {
      let ids: string[] = [node.id]
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          ids = [...ids, ...getAllChildIdsInline(child as CustomTreeViewItem)]
        })
      }
      return ids
    }

    checkboxId.forEach(code => {
      const node = findNodeByCodeInline(transformData, code)
      if (node) {
        const childIds = getAllChildIdsInline(node)
        newSelectedItems.push(...childIds)
      }
    })

    // 更新父节点的选中状态
    const updateParentNodes = (items: string[]): string[] => {
      const result = [...items]
      let hasChanges = false

      // 检查每个节点的父节点
      const checkParentsRecursively = (nodeId: string) => {
        const parentId = getParentId(nodeId)
        if (!parentId) return // 没有父节点

        // 获取所有兄弟节点ID
        const allSiblingIds = getDirectChildrenIds(parentId)

        // 检查是否所有兄弟节点都已被选中
        const allSiblingsSelected = allSiblingIds.every(id => result.includes(id))

        if (allSiblingsSelected && !result.includes(parentId)) {
          // 如果所有子节点都被选中，但父节点没有被选中，则选中父节点
          result.push(parentId)
          hasChanges = true
          // 递归检查更高层级的父节点
          checkParentsRecursively(parentId)
        }
      }

      // 对所有已选择的节点检查其父节点
      items.forEach(nodeId => {
        checkParentsRecursively(nodeId)
      })

      // 如果有变化，继续递归调用，直到没有更多的变化
      if (hasChanges) {
        return updateParentNodes(result)
      }
      return result
    }

    // 对已选择的项目应用父节点更新
    const finalSelectedItems = updateParentNodes(newSelectedItems)

    if (finalSelectedItems.length > 0 && !initialized) {
      setSelectedItems(finalSelectedItems)
      setInitialized(true)
    }
  }, [checkboxId, transformData, initialized, getParentId, getDirectChildrenIds])

  const renderTreeItems = (nodes: CustomTreeViewItem[]) => {
    return nodes.map((node: CustomTreeViewItem) => {
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
            renderTreeItems(node.children as CustomTreeViewItem[])}
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
