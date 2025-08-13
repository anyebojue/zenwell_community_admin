import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BusinessPurchaseApplyParams } from 'api/model/property/purchase/businessPurchaseApplyModel'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add, Download } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const OwnerCarIndex = () => {
  const navigate = useNavigate()
  const { exportUrl } = useSelector((state: RootState) => state.OwnerCarSlice)
  const [dialogValue, setDialogValue] = useState<BusinessPurchaseApplyParams | undefined>()

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">采购申请</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => navigate('/purchase/Procurement')}
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
        </Box>
        <TableData dialogValue={dialogValue} setDialogValue={setDialogValue} />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(OwnerCarIndex)
