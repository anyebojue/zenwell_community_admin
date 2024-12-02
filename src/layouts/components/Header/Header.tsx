import { memo } from 'react'
import { Stack, drawerClasses, Avatar, Typography, IconButton } from '@mui/material'
import ColorModeIconDropdown from 'theme/ColorModeIconDropdown'
import avatar from 'assets/global/windows.jpg'
import { Menu, Translate } from '@mui/icons-material'
import Search from './Search'
import OptionsMenu from './OptionsMenu'

const Header = ({
  isMenuOpen,
  onToggleMenu
}: {
  isMenuOpen: boolean
  onToggleMenu: () => void
}) => {
  return (
    <Stack
      direction="row"
      sx={theme => ({
        position: 'fixed',
        top: 0,
        right: 0,
        backgroundColor: theme.palette.background.default,
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.white'
        },
        display: { xs: 'none', md: 'flex' },
        width: isMenuOpen ? 'calc(100% - 260px)' : 'calc(100% - 60px)',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        py: 1.5,
        px: 1.5,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider
      })}
      spacing={2}
    >
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          borderColor: 'divider'
        }}
      >
        <IconButton size="small" color="inherit" onClick={onToggleMenu}>
          <Menu />
        </IconButton>
        <Search />
      </Stack>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          borderColor: 'divider'
        }}
      >
        <IconButton size="small" color="inherit">
          <Translate />
        </IconButton>
        <ColorModeIconDropdown />
        <OptionsMenu />
        <Avatar sizes="small" alt="Riley Carter" src={avatar} sx={{ width: 32, height: 32 }} />
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
          WhiteFox
        </Typography>
      </Stack>
    </Stack>
  )
}

export default memo(Header)
