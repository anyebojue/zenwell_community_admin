import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/spectionTask'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import message from 'components/Message'
import { SpectionTaskReply } from 'api/model/property/spectionTaskModel'
import AMapExample from 'components/AMapExample'
import { SpectionPlanReply } from 'api/model/property/spectionPlanModel'

interface TaskIndexProps {
  dialogValue: SpectionPlanReply
}

const TaskIndex: React.FC<TaskIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.SpectionTaskSlice)
  const MUI_X_PRODUCTS = list.map(item => ({
    id: item.id,
    label: `${item.actUserName}\n${item.actInsTime}`
  }))
  const [dialogTaskValue, setDialogTaskValue] = useState<SpectionTaskReply>({})

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        find({ 'page.num': page.num, 'page.size': page.size, inspectionPointId: dialogValue.id })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dialogValue.id, dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!list || list.length === 0) {
      setDialogTaskValue({})
    } else {
      setDialogTaskValue(list[0])
    }
  }, [list])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        selectedItems={dialogTaskValue?.id || ''}
        onSelectedItemsChange={(_, itemId) => {
          const data = list.filter(item => item.id === itemId)
          if (data.length > 0) {
            setDialogTaskValue(data[0])
          }
        }}
      />
      <AMapExample mapHeight="400px" />
    </Box>
  )
}

export default memo(TaskIndex)
