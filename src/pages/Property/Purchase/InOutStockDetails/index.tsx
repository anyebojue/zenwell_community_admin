import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Download } from '@mui/icons-material'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const OwnerCarIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.OwnerCarSlice)

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">出入库明细</Typography>
          <Stack direction="row" spacing={1}>
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
        <TableData />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(OwnerCarIndex)
