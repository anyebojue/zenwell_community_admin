import { memo } from 'react'
import { Stack, drawerClasses, Avatar, Typography, IconButton } from '@mui/material'
import ColorModeIconDropdown from 'theme/ColorModeIconDropdown'
import avatar from 'assets/global/windows.jpg'
import { Menu, Translate } from '@mui/icons-material'
import Search from './Search'
import OptionsMenu from './OptionsMenu'

const Header = () => {
  return (
    <Stack
      direction="row"
      sx={theme => ({
        position: 'fixed', // 固定定位
        top: 0, // 距离页面顶部 0
        right: 0, // 距离页面右侧 0
        backgroundColor: theme.palette.background.default, // 背景颜色可以根据需求修改
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.white'
        },
        display: { xs: 'none', md: 'flex' },
        width: 'calc(100% - 260px)',
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
        <IconButton size="small" color="inherit">
          <Menu />
        </IconButton>
        {/* 搜索框 */}
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
        {/* 国际化 */}
        <IconButton size="small" color="inherit">
          <Translate />
        </IconButton>
        {/* 切换主题 */}
        <ColorModeIconDropdown />
        {/* 设置 */}
        <OptionsMenu />
        {/* 头像 */}
        <Avatar sizes="small" alt="Riley Carter" src={avatar} sx={{ width: 32, height: 32 }} />
        {/* 昵称 */}
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
          WhiteFox
        </Typography>
      </Stack>
    </Stack>
  )
}

export default memo(Header)
