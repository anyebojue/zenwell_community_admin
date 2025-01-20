import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import message from 'components/Message'
import AMapExample from 'components/AMapExample'
import { findPoint } from 'modules/property/spectionPoint'
import { SpectionPointReply } from 'api/model/property/spectionPointModel'

interface RouteIndexProps {
  dialogValue: SpectionPointReply
}

const RouteIndex: React.FC<RouteIndexProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, pointList } = useSelector((state: RootState) => state.SpectionPointSlice)
  const spectionRoutes = pointList.map(item => item.spectionRoute)

  const MUI_X_PRODUCTS = spectionRoutes.map(item => ({
    id: item.id!,
    label: item.name!
  }))

  const [value, setValue] = useState(() => (spectionRoutes.length > 0 ? spectionRoutes[0] : {}))

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(
        findPoint({
          'page.num': page.num,
          'page.size': page.size,
          inspectionPointId: dialogValue.id
        })
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
    if (spectionRoutes.length > 0 && !value?.id) {
      setValue(spectionRoutes[0])
    }
  }, [spectionRoutes, value?.id])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%', display: 'flex' }}>
      <RichTreeView
        sx={{ width: '20%', mr: 2 }}
        items={MUI_X_PRODUCTS}
        selectedItems={value?.id || ''}
        onSelectedItemsChange={(_, itemId) => {
          const data = spectionRoutes.find(item => item.id === itemId)
          if (data && data.id !== value?.id) {
            setValue(data)
          }
        }}
      />
      <AMapExample mapHeight={'400px'} />
    </Box>
  )
}

export default memo(RouteIndex)
