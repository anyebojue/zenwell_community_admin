import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuReply } from 'api/model/develop/menuModel'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { findMenus } from 'modules/develop/menu'
import { Box } from '@mui/material'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import message from 'components/Message'

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
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.MenuSlice)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({})
  const apiRef = useTreeViewApiRef()
  console.log(dialogValue)

  const renameNameToLabel = (obj: MenuReply[]): MenuReply[] => {
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

  const transformedList: MenuReply[] = Array.isArray(list) ? renameNameToLabel(list) : []

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
  )
}

export default memo(Feature)
