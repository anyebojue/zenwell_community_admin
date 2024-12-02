import { memo } from 'react'
import { styled, Box, drawerClasses } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { useTheme } from '@mui/material/styles'
import zenwellLogoLight from 'assets/global/zenwell-logo.png'
import zenwellLogoDark from 'assets/global/zenwell-logo-white.png'
import MenuContent from './MenuContent'

const drawerWidth = 260

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
  const theme = useTheme()
  const logo = theme.palette.mode === 'dark' ? zenwellLogoDark : zenwellLogoLight

  return (
    <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' } }}>
      <Box
        sx={{
          height: '60px',
          padding: '15px 25px 10px',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center'
        }}
      >
        <img style={{ height: '100%' }} src={logo} alt="zenwell" />
      </Box>
      <MenuContent />
    </Drawer>
  )
}

export default memo(SideMenu)
