import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Divider, Drawer, Stack, Typography } from '@mui/material'
import { drawerClasses } from '@mui/material/Drawer'
import { LogoutRounded, Close } from '@mui/icons-material'
import avatar from 'assets/global/windows.jpg'
import MenuContent from './MenuContent'
import MenuButton from './MenuButton'

interface SideMenuMobileProps {
  open: boolean
  toggleDrawer: () => void
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate('/login')
    localStorage.removeItem('zenwell_token')
    localStorage.removeItem('current_community')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper'
        }
      }}
    >
      <Stack
        sx={{
          minWidth: '240px',
          height: '100%'
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Avatar sizes="small" alt="Riley Carter" src={avatar} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
              WhiteFox
            </Typography>
          </Stack>
          <MenuButton onClick={toggleDrawer}>
            <Close />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent isMenuOpen={true} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            onClick={() => handleLogout}
            variant="outlined"
            fullWidth
            startIcon={<LogoutRounded />}
          >
            退出登录
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
