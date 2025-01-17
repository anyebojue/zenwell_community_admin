import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/spectionTask'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import message from 'components/Message'
import { SpectionTaskReply } from 'api/model/property/spectionTaskModel'
import AMapExample from 'components/AMapExample'

const TaskIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskSlice)
  const MUI_X_PRODUCTS = list.map(item => ({
    id: item.id,
    label: `${item.actUserName}\n${item.startTime}`
  }))
  const [dialogValue, setDialogValue] = useState<SpectionTaskReply>({})

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

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

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
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
      <AMapExample />
    </Box>
  )
}

export default memo(TaskIndex)
