import { ChangeEvent, Dispatch, memo, SetStateAction, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityParams } from 'api/model/communityModel'
import { find } from 'modules/community'
import { Box, FormControl, Button, MenuItem, Stack, TextField } from '@mui/material'
import { Add, Delete, History, Search } from '@mui/icons-material'
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

const city = [{ value: '0', label: '北京' }]

interface SearchFormProps {
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<SearchFormProps> = ({ selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CommunitySlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<CommunityParams>({
    id: '',
    name: '',
    city_code: ''
  })

  const handleInputChange =
    (field: keyof CommunityParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const handleSelectChange =
    (field: keyof CommunityParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: CommunityParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size, ...params }))
      } catch {
        message.error('列表加载失败，请刷新页面或检查网络问题')
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
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入小区ID"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入小区名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.name}
            onChange={handleInputChange('name')}
          />
        </FormControl>
        <Stack direction="row" spacing={1}>
          {['city_code', 'city_code', 'city_code'].map((field, index) => (
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined" key={index}>
              <TextField
                select
                size="small"
                label={`请选择${['省', '市', '县'][index]}`}
                value={searchParams[field as keyof CommunityParams]}
                onChange={handleSelectChange(field as keyof CommunityParams)}
                variant="outlined"
                sx={textFieldStyles}
              >
                {city.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          ))}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} component="form" sx={{ mb: 2 }}>
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
            setSearchParams({ id: '', name: '', city_code: '' })
            fetchData({
              id: '',
              name: '',
              city_code: '',
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
          startIcon={<Add />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => setOpenDialog(true)}
        >
          新增
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
      <FormDialog openDialog={openDialog} dialogType="add" setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(FormSearch)
