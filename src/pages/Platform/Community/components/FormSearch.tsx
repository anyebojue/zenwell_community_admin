import {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useState,
  useCallback,
  useEffect
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityParams } from 'api/model/platform/communityModel'
import { CityAreaReply } from 'api/model/cityModel'
import { find } from 'modules/platform/community'
import { Box, FormControl, Button, MenuItem, Stack, TextField, FormLabel } from '@mui/material'
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

interface SearchFormProps {
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<SearchFormProps> = ({ selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CommunitySlice)
  const { cityData } = useSelector((state: RootState) => state.info)
  const cityList = [...cityData.list].reverse()
  const [cities, setCities] = useState<CityAreaReply[]>([])
  const [counties, setCounties] = useState<CityAreaReply[]>([])

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<CommunityParams>({
    id: '',
    name: '',
    city_code: '',
    province_code: '',
    county_code: ''
  })

  useEffect(() => {
    if (searchParams.province_code) {
      setCities(
        cityList.filter(
          item => item.parentAreaCode === searchParams.province_code && item.areaLevel === '202'
        )
      )
    } else {
      setCities([])
    }
  }, [searchParams.province_code, cityList])

  useEffect(() => {
    if (searchParams.city_code) {
      setCounties(
        cityList.filter(
          item => item.parentAreaCode === searchParams.city_code && item.areaLevel === '303'
        )
      )
    } else {
      setCounties([])
    }
  }, [searchParams.city_code, cityList])

  const handleInputChange =
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
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params })
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
    fetchData({ ...searchParams, city_code: searchParams.county_code })
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormLabel>小区地区：</FormLabel>
          <Stack direction="row" spacing={1}>
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <TextField
                select
                size="small"
                label="请选择省"
                value={searchParams.province_code}
                onChange={e =>
                  setSearchParams(prev => ({
                    ...prev,
                    province_code: e.target.value,
                    city_code: '',
                    county_code: ''
                  }))
                }
                variant="outlined"
              >
                {cityList
                  .filter(item => item.areaLevel === '101')
                  .map(option => (
                    <MenuItem key={option.areaCode} value={option.areaCode}>
                      {option.areaName}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <TextField
                select
                size="small"
                label="请选择市"
                value={searchParams.city_code}
                onChange={e =>
                  setSearchParams(prev => ({ ...prev, city_code: e.target.value, county_code: '' }))
                }
                variant="outlined"
              >
                {cities.map(option => (
                  <MenuItem key={option.areaCode} value={option.areaCode}>
                    {option.areaName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <TextField
                select
                size="small"
                label="请选择县"
                value={searchParams.county_code}
                onChange={e => setSearchParams(prev => ({ ...prev, county_code: e.target.value }))}
                variant="outlined"
              >
                {counties.map(option => (
                  <MenuItem key={option.areaCode} value={option.areaCode}>
                    {option.areaName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Stack>
        </Box>
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
