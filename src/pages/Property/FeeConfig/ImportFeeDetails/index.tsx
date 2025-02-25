import { memo } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ApplyRoomDiscountTypeIndex = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">导入费用详情</Typography>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Close />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        </Box>
        <TableData />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ApplyRoomDiscountTypeIndex)
