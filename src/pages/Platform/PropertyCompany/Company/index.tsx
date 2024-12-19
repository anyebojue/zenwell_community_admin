import { memo } from 'react'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const CompanyIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">小区信息</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
              >
                加入小区
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Close />}
                sx={buttonStyles('#2660ad', '#1d428a')}
              >
                返回
              </Button>
            </Stack>
          </Box>
          <TableData />
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(CompanyIndex)
