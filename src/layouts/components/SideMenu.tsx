import { memo } from 'react'
import { styled, Box, drawerClasses } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { useTheme } from '@mui/material/styles'
import zenwellLogoLight from 'assets/global/zenwell-logo.png'
import zenwellLogoDark from 'assets/global/zenwell-logo-white.png'
import logomini from 'assets/global/zenwell-logo-mini.png'
import MenuContent from './MenuContent'

const drawerWidth = 260
const collapsedWidth = 60

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

const SideMenu = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const theme = useTheme()
  const logo = theme.palette.mode === 'dark' ? zenwellLogoDark : zenwellLogoLight

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMenuOpen ? drawerWidth : collapsedWidth,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: isMenuOpen ? drawerWidth : collapsedWidth,
          transition: 'width 0.3s ease'
        }
      }}
    >
      <Box
        sx={{
          height: '60px',
          padding: isMenuOpen ? '15px 25px 10px' : '14px',
          display: 'flex',
          justifyContent: isMenuOpen ? 'left' : 'center',
          alignItems: 'center'
        }}
      >
        {isMenuOpen ? (
          <img style={{ height: '100%' }} src={logo} alt="zenwell" />
        ) : (
          <img style={{ height: '100%' }} src={logomini} alt="zenwell" />
        )}
      </Box>
      <MenuContent isMenuOpen={isMenuOpen} />
    </Drawer>
  )
}

export default memo(SideMenu)
