import { memo } from 'react'
import { Stack, drawerClasses, Avatar, Typography } from '@mui/material'
import ColorModeIconDropdown from 'theme/ColorModeIconDropdown'
import avatar from 'assets/global/windows.jpg'
import MenuButton from '../MenuButton'
import NavbarBreadcrumbs from './NavbarBreadcrumbs'
import Search from './Search'
import OptionsMenu from './OptionsMenu'

const Header = () => {
  return (
    <Stack
      direction="row"
      sx={theme => ({
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.white'
        },
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        py: 1.5,
        px: 3,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider
      })}
      spacing={2}
    >
      {/* 面包屑 */}
      <NavbarBreadcrumbs />
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          borderColor: 'divider'
        }}
      >
        {/* 搜索框 */}
        <Search />
        {/* 头像 */}
        <Avatar sizes="small" alt="Riley Carter" src={avatar} sx={{ width: 32, height: 32 }} />
        {/* 昵称 */}
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
          WhiteFox
        </Typography>
        {/* 切换主题 */}
        <ColorModeIconDropdown />
        {/* 设置 */}
        <MenuButton>
          <OptionsMenu />
        </MenuButton>
      </Stack>
    </Stack>
  )
}

export default memo(Header)
