import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenusReply } from 'api/model/develop/menuModel'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { findMenus } from 'modules/develop/menu'
import { Box } from '@mui/material'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import message from 'components/Message'

interface TreeViewItemWithSelected extends TreeViewBaseItem {
  isSelected: boolean
}

interface FeatureProps {
  dialogValue: RolesReply
}

const getItemDescendantsIds = (item: TreeViewBaseItem) => {
  const ids: string[] = []
  item.children?.forEach(child => {
    ids.push(child.id)
    ids.push(...getItemDescendantsIds(child))
  })

  return ids
}

const Feature: React.FC<FeatureProps> = ({ dialogValue }) => {
  const apiRef = useTreeViewApiRef()
  const dispatch = useDispatch<AppDispatch>()
  const { menus } = useSelector((state: RootState) => state.MenuSlice)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({})

  const transformData = useMemo(() => {
    const transformNode = (node: MenusReply): TreeViewItemWithSelected => {
      const isSelected = dialogValue.actions?.some(action => action.code === node.code) || false
      return {
        id: node.id as string,
        label: node.name as string,
        children: node.children?.length ? node.children.map(transformNode) : [],
        isSelected // Add the isSelected flag
      } as TreeViewItemWithSelected
    }
    return menus?.map(transformNode) || []
  }, [menus, dialogValue])

  // Fetch menus from the server
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
    const initiallySelectedItems: string[] = []
    const traverse = (node: TreeViewBaseItem) => {
      if ('isSelected' in node && node.isSelected) {
        initiallySelectedItems.push(node.id)
      }
      node.children?.forEach(traverse)
    }
    transformData.forEach(traverse)
    setSelectedItems(initiallySelectedItems)
  }, [transformData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
    let newSelectedItemsWithChildren = Array.from(
      new Set([...newSelectedItems, ...itemsToSelect].filter(itemId => !itemsToUnSelect[itemId]))
    )
    const checkAndUpdateParents = (items: string[]) => {
      const itemMap = new Map(items.map(id => [id, true]))
      const traverse = (item: TreeViewBaseItem) => {
        if (item.children?.length) {
          const allChildrenSelected = item.children.every(child => itemMap.has(child.id))
          const allChildrenUnselected = item.children.every(child => !itemMap.has(child.id))

          if (allChildrenSelected) {
            itemMap.set(item.id, true)
          }
          if (allChildrenUnselected) {
            itemMap.delete(item.id)
          }

          item.children.forEach(traverse)
        }
      }
      transformData.forEach(traverse)
      return Array.from(itemMap.keys())
    }
    newSelectedItemsWithChildren = checkAndUpdateParents(newSelectedItemsWithChildren)
    setSelectedItems(newSelectedItemsWithChildren)
    toggledItemRef.current = {}
  }

  return (
    <Box>
      <RichTreeView
        multiSelect
        checkboxSelection
        apiRef={apiRef}
        items={transformData}
        selectedItems={selectedItems}
        onSelectedItemsChange={handleSelectedItemsChange}
        onItemSelectionToggle={handleItemSelectionToggle}
      />
    </Box>
  )
}

export default memo(Feature)
