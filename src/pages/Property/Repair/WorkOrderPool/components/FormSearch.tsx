import { ChangeEvent, memo, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityAnnouncementParams } from 'api/model/property/communityAnnouncementModel'
import { find } from 'modules/property/communityAnnouncement'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Delete, History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormDialog from './FormDialog'

const textFieldStyles = {
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

interface FormSearchProps {
  selectedButton: number
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton, selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CommunityAnnouncementSlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<CommunityAnnouncementParams>({
    title: ''
  })

  const handleInputChange =
    (field: keyof CommunityAnnouncementParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: CommunityAnnouncementParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...params
          })
        )
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        closeLoading()
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch, page.num, page.size]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入工单编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入报修人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入报修人电话"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择报修类型"
            value={searchParams.title || ''}
            onChange={handleInputChange('title')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[{ value: 100, label: '工单池派单' }].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择报修设置类型"
            value={searchParams.title || ''}
            onChange={handleInputChange('title')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '100', label: '维修单' },
              { value: '200', label: '保洁单' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入报修位置"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择维修类型"
            value={searchParams.title || ''}
            onChange={handleInputChange('title')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1001', label: '有偿服务' },
              { value: '1002', label: '无偿服务' },
              { value: '1003', label: '需要用料' },
              { value: '1004', label: '无需用科' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请选择开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请选择结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.title}
            onChange={handleInputChange('title')}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Search />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={handleSearch}
        >
          查询
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<History />}
          sx={buttonStyles('darkgray', '#696969')}
          onClick={() => {
            setSearchParams({ title: '' })
            fetchData({
              title: '',
              'page.num': page.num,
              'page.size': page.size
            })
          }}
        >
          重置
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonStyles('#B22222', '#8B0000')}
          onClick={() => {
            if (![...selectedRows].length) {
              return message.warning('请选择至少一项')
            }
            setDelOpen(true)
          }}
        >
          批量删除
        </Button>
      </Stack>
      <FormDialog
        selectedButton={selectedButton}
        openDialog={openDialog}
        dialogType="add"
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(FormSearch)
