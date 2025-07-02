import { memo, useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { FeeComboReply } from 'api/model/property/feeConfig/feeComboModel'
import { find } from 'modules/property/feeConfig/feeCombo'
import { find as findMember } from 'modules/property/feeConfig/feeComboMember'
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
import { Add, Close, Search } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
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
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { page, list } = useSelector((state: RootState) => state.FeeComboMemberSlice)
  const { list: feeComboList } = useSelector((state: RootState) => state.FeeComboSlice)
  const { roomData } = location.state as { roomData: RoomReply }
  const [openDialog, setOpenDialog] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredCommunities, setFilteredCommunities] = useState(feeComboList)
  const [formData, setFormData] = useState<
    {
      id: string
      communityId: string
      feeTypeCdName: string
      feeName: string
      feeFlagName: string
      startTime: string
      endTime: string
    }[]
  >([])

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    setFilteredCommunities(feeComboList)
  }, [feeComboList])

  useEffect(() => {
    fetchData(find, { 'page.num': page.num, 'page.size': page.size }, '正在加载列表中，请稍后...')
  }, [fetchData, page.num, page.size])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    const filtered = feeComboList.filter(item =>
      item.name?.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredCommunities(filtered)
  }

  const handleSelect = async (row: FeeComboReply) => {
    fetchData(
      findMember,
      { 'page.num': page.num, 'page.size': page.size, comboId: row.id! },
      '正在加载列表中，请稍后...'
    )
    setOpenDialog(false)
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
        <TableData list={list} formData={formData} setFormData={setFormData} />
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
