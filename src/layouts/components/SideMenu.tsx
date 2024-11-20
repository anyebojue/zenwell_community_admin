import { memo } from 'react'
import { styled, Box, drawerClasses, Divider } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import zenwellLogo from 'assets/global/zenwell-logo.png'
import MenuContent from './MenuContent'

const drawerWidth = 230

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box'
  }
})

const SideMenu = () => {
  return (
    <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' } }}>
      <Box
        sx={{
          height: '60px',
          padding: '10px 10px 10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img style={{ height: '100%' }} src={zenwellLogo} alt="zenwell" />
      </Box>
      <Divider />
      <MenuContent />
    </Drawer>
  )
}

export default memo(SideMenu)
