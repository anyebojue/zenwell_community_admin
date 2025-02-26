import { memo, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Theme,
  Typography
} from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add, Close, Search } from '@mui/icons-material'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { FeeComboReply } from 'api/model/property/feeConfig/feeComboModel'
import TableData from './components/TableData'

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

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const MeterTypeIndex = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { list: feeComboList } = useSelector((state: RootState) => state.FeeComboSlice)
  const { roomData } = location.state as { roomData: RoomReply }
  const [openDialog, setOpenDialog] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredCommunities, setFilteredCommunities] = useState(feeComboList)

  useEffect(() => {
    setFilteredCommunities(feeComboList)
  }, [feeComboList])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    const filtered = feeComboList.filter(item =>
      item.name?.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredCommunities(filtered)
  }

  const handleSelect = (row: FeeComboReply) => {
    localStorage.setItem('current_community', JSON.stringify(row))
    window.location.reload()
    navigate('/communitys/my-communitys')
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {roomData?.roomNum}-{roomData?.unit?.unitNum}-{roomData?.unit?.floor?.floorNum}
            创建费用（根据费用套餐创建）
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Search />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              选择费用套餐
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              创建
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
          </Stack>
        </Box>
        <TableData />
      </Box>
      <Copyright />
      <Dialog maxWidth="lg" open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          选择费用套餐
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            placeholder="请输入套餐名称"
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
                field: 'name',
                headerName: '套餐名称',
                width: 250,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'createdAt',
                headerName: '创建时间',
                width: 150,
                headerAlign: 'center',
                align: 'center'
              },
              {
                field: 'remark',
                headerName: '说明',
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
    </Box>
  )
}

export default memo(MeterTypeIndex)
