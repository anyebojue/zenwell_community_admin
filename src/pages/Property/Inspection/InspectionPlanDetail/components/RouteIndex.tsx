import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import message from 'components/Message'
import AMapExample from 'components/AMapExample'
import { find } from 'modules/property/spectionRoute'
import { SpectionRouteReply } from 'api/model/property/spectionRouteModel'
import { SpectionPlanReply } from 'api/model/property/spectionPlanModel'

interface RouteIndexProps {
  dialogValue: SpectionPlanReply
}

const RouteIndex: React.FC<RouteIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [dialogRouteValue, setDialogRouteValue] = useState<SpectionRouteReply | undefined>({})
  const MUI_X_PRODUCTS = useMemo(() => {
    return [dialogValue.spectionRoute].map(item => ({
      id: item?.id,
      label: item?.name
    }))
  }, [dialogValue.spectionRoute])

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true, inspectionPlanId: dialogValue.id }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dialogValue.id, dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!dialogValue.spectionRoute || [dialogValue.spectionRoute].length === 0) {
      setDialogRouteValue({})
    } else {
      setDialogRouteValue([dialogValue.spectionRoute][0])
    }
  }, [dialogValue.spectionRoute])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%', display: 'flex' }}>
      <RichTreeView
        sx={{ width: '20%', mr: 2 }}
        items={MUI_X_PRODUCTS}
        selectedItems={dialogRouteValue?.id || ''}
        onSelectedItemsChange={(_, itemId) => {
          const data = [dialogValue.spectionRoute].filter(item => item?.id === itemId)
          if (data.length > 0) {
            setDialogRouteValue(data[0])
          }
        }}
      />
      <AMapExample mapHeight={'400px'} />
    </Box>
  )
}

export default memo(RouteIndex)
