import { memo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import JoinCommunity from './components/JoinCommunity'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const CompanyIndex = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openJoinCommunity, setOpenJoinCommunity] = useState(false)
  const id = location.state?.id

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
                onClick={() => setOpenJoinCommunity(true)}
              >
                加入小区
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Close />}
                onClick={() => navigate(-1)}
              >
                返回
              </Button>
            </Stack>
          </Box>
          <TableData />
        </Box>
      </Box>
      <Copyright />
      <JoinCommunity
        storeId={id}
        openJoinCommunity={openJoinCommunity}
        setOpenJoinCommunity={setOpenJoinCommunity}
      />
    </Box>
  )
}

export default memo(CompanyIndex)
