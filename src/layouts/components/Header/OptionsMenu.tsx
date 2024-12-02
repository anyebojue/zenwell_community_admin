import { Fragment, useState, MouseEvent, memo } from 'react'
import {
  styled,
  dividerClasses,
  Menu,
  paperClasses,
  listClasses,
  ListItemText,
  ListItemIcon,
  listItemIconClasses
} from '@mui/material'
import MuiMenuItem from '@mui/material/MenuItem'
import { LogoutRounded, Settings } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import MenuButton from '../MenuButton'

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0'
})

const OptionsMenu = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = () => {
    setAnchorEl(null)
    navigate('/login')
  }
  return (
    <Fragment>
      <MenuButton aria-label="Open menu" onClick={handleClick}>
        <Settings />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px'
          },
          [`& .${paperClasses.root}`]: {
            padding: 0
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px'
          }
        }}
      >
        <MenuItem onClick={handleClose}>设置</MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0
            }
          }}
        >
          <ListItemText>退出登录</ListItemText>
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default memo(OptionsMenu)
