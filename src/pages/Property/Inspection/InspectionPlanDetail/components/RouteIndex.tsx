import { memo, useEffect, useMemo, useState } from 'react'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import AMapExample from 'components/AMapExample'
import { SpectionRouteReply } from 'api/model/property/inspection/spectionRouteModel'
import { SpectionPlanReply } from 'api/model/property/inspection/spectionPlanModel'

interface RouteIndexProps {
  dialogValue: SpectionPlanReply
}

const RouteIndex: React.FC<RouteIndexProps> = ({ dialogValue }) => {
  const [dialogRouteValue, setDialogRouteValue] = useState<SpectionRouteReply | undefined>({})
  const MUI_X_PRODUCTS = useMemo(() => {
    return [dialogValue.spectionRoute].map(item => ({
      id: item?.id,
      label: item?.name
    }))
  }, [dialogValue.spectionRoute])

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
      <AMapExample mapHeight="400px" />
    </Box>
  )
}

export default memo(RouteIndex)
