import { memo } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Download } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReturnPayFeeIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.ReturnPayFeeSlice)

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">押金报表(押金类记录的收费情况)</Typography>
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
        </Box>
        <TableData />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReturnPayFeeIndex)
