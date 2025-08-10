import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BusinessPurchaseApplyParams } from 'api/model/property/purchase/businessPurchaseApplyModel'
import { Box, Button, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add, Download } from '@mui/icons-material'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const OwnerCarIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.OwnerCarSlice)
  const [dialogValue, setDialogValue] = useState<BusinessPurchaseApplyParams | undefined>()

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={1.5}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <FormSearch />
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => {}}
              >
                采购申请
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => {}}
              >
                紧急采购
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => {
                  if (exportUrl) {
                    window.open(exportUrl, '_blank')
                  } else {
                    alert('暂无导出链接')
                  }
                }}
              >
                导出
              </Button>
            </Stack>
            <TableData dialogValue={dialogValue} setDialogValue={setDialogValue} />
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(OwnerCarIndex)
