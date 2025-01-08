import { memo, useEffect, useState } from 'react'
import {
  Stack,
  Avatar,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  SelectChangeEvent,
  drawerClasses
} from '@mui/material'
import { Close, Menu, Send, Translate } from '@mui/icons-material'
import ColorModeIconDropdown from 'theme/ColorModeIconDropdown'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { CommunityReply } from 'api/model/platform/communityModel'
import { useNavigate } from 'react-router-dom'
import Search from './Search'
import OptionsMenu from './OptionsMenu'

const textFieldStyles = {
  mt: 0.1,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid',
      borderColor: 'primary.main'
    }
  }
}

interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

const Header = ({ isMenuOpen, onToggleMenu }: HeaderProps) => {
  const navigate = useNavigate()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [community, setCommunity] = useState<string | undefined>()
  const [openDialog, setOpenDialog] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredCommunities, setFilteredCommunities] = useState(info.community)

  useEffect(() => {
    if (info.community.length) {
      const currentCommunity = localStorage.getItem('current_community')
      const communityData = currentCommunity ? JSON.parse(currentCommunity) : null
      if (communityData) {
        setCommunity(communityData.id)
        setFilteredCommunities(info.community)
      } else {
        setCommunity(info.community[0].id)
        localStorage.setItem('current_community', JSON.stringify(info.community[0] || ''))
      }
    } else {
      setCommunity('')
    }
  }, [info.community])

  const handleCommunityChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value
    if (value === '') {
      setOpenDialog(true)
    } else {
      setCommunity(value as string)
      const selectedCommunity = info.community.find(item => item.id === value)
      if (selectedCommunity) {
        localStorage.setItem('current_community', JSON.stringify(selectedCommunity))
        window.location.reload()
        navigate('/communitys/my-communitys')
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    const filtered = info.community.filter(item =>
      item.name?.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredCommunities(filtered)
  }

  const handleSelect = (row: CommunityReply) => {
    localStorage.setItem('current_community', JSON.stringify(row))
    window.location.reload()
    navigate('/communitys/my-communitys')
  }

  return (
    <>
      <Stack
        direction="row"
        sx={theme => ({
          zIndex: 999,
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
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <IconButton size="small" color="inherit" onClick={onToggleMenu}>
            <Menu />
          </IconButton>
          <Search />
        </Stack>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          {info.platform === '0' && (
            <Select
              sx={{
                border: 'none',
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
              size="small"
              value={community}
              onChange={handleCommunityChange}
              displayEmpty
            >
              {info.community.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
              <MenuItem value="" onClick={() => setOpenDialog(true)}>
                <strong>更多小区</strong>
                <Send sx={{ ml: 1 }} fontSize="small" />
              </MenuItem>
            </Select>
          )}
          <IconButton size="small" color="inherit">
            <Translate />
          </IconButton>
          <ColorModeIconDropdown />
          <OptionsMenu />
          <Avatar sizes="small" alt={info.username} src="" sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px', pr: 2 }}>
            {info.username}
          </Typography>
        </Stack>
      </Stack>
      <Dialog maxWidth="lg" open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          切换小区
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            placeholder="请输入小区名称"
            size="small"
            variant="outlined"
            sx={textFieldStyles}
            value={searchText}
            onChange={handleSearch}
          />
          <DataGrid
            sx={{ mt: 2 }}
            disableRowSelectionOnClick
            disableColumnMenu
            rows={filteredCommunities}
            columns={[
              {
                field: 'id',
                headerName: '小区ID',
                width: 250,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'name',
                headerName: '名称',
                width: 150,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'address',
                headerName: '地址',
                width: 200,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'actions',
                headerName: '操作',
                type: 'actions',
                width: 100,
                headerAlign: 'center',
                align: 'center',
                getActions: ({ row }) => [
                  <Button key="select" onClick={() => handleSelect(row)}>
                    选择
                  </Button>
                ]
              }
            ]}
            pageSizeOptions={[25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25
                }
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(Header)
