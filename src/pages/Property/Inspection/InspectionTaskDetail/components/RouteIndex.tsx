import { memo, useEffect, useMemo, useState } from 'react'
import { RichTreeView } from '@mui/x-tree-view'
import { Box } from '@mui/material'
import AMapExample from 'components/AMapExample'
import { SpectionRouteReply } from 'api/model/property/spectionRouteModel'
import { SpectionTaskReply } from 'api/model/property/spectionTaskModel'

interface RouteIndexProps {
  dialogValue: SpectionTaskReply
}

const RouteIndex: React.FC<RouteIndexProps> = ({ dialogValue }) => {
  const [dialogRouteValue, setDialogRouteValue] = useState<SpectionRouteReply | undefined>({})
  const MUI_X_PRODUCTS = useMemo(() => {
    return [dialogValue.spectionPlan?.spectionRoute].map(item => ({
      id: item?.id,
      label: item?.name
    }))
  }, [dialogValue.spectionPlan?.spectionRoute])

  useEffect(() => {
    if (
      !dialogValue.spectionPlan?.spectionRoute ||
      [dialogValue.spectionPlan?.spectionRoute].length === 0
    ) {
      setDialogRouteValue({})
    } else {
      setDialogRouteValue([dialogValue.spectionPlan?.spectionRoute][0])
    }
  }, [dialogValue.spectionPlan?.spectionRoute])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%', display: 'flex' }}>
      <RichTreeView
        sx={{ width: '20%', mr: 2 }}
        items={MUI_X_PRODUCTS}
        selectedItems={dialogRouteValue?.id || ''}
        onSelectedItemsChange={(_, itemId) => {
          const data = [dialogValue.spectionPlan?.spectionRoute].filter(item => item?.id === itemId)
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
