import { memo } from 'react'
import { styled, Box, drawerClasses, Divider } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import zenwellLogo from 'assets/global/zenwell.png'
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
      <Box sx={{ padding: '20px 25px 12px' }}>
        <img style={{ width: '100%' }} src={zenwellLogo} alt="zenwell" />
      </Box>
      <Divider />
      <MenuContent />
    </Drawer>
  )
}

export default memo(SideMenu)
