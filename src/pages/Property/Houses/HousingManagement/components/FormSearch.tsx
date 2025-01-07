import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import { find } from 'modules/property/room'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RoomParams } from 'api/model/property/roomModel'

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
  dialogValue: HousingManagementReply
}

const FormSearch: React.FC<FormSearchProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [searchParams, setSearchParams] = useState<RoomParams>({
    state: '',
    roomSubType: '',
    unitId: ''
  })

  const handleInputChange = (field: keyof RoomParams) => (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prevData => ({
      ...prevData,
      [field]: event.target.value
    }))
  }

  const fetchData = useCallback(
    async (params: RoomParams & PaginationParams) => {
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

  const handleSelectChange =
    (field: keyof RoomParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请填写房屋编号 格式 楼栋-单元"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.unitId}
            onChange={handleInputChange('unitId')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择状态"
            value={searchParams.state}
            onChange={handleSelectChange('state')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '2001', label: '已入住' },
              { value: '2002', label: '未销售' },
              { value: '2003', label: '已交房' },
              { value: '2004', label: '未入住' },
              { value: '2005', label: '已装修' },
              { value: '2006', label: '已出租' },
              { value: '2007', label: '已出售' },
              { value: '2008', label: '空闲' },
              { value: '2009', label: '装修中' }
            ].map(option => (
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
            label="请选择房屋类型"
            value={searchParams.roomSubType}
            onChange={handleSelectChange('roomSubType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '110', label: '住宅' },
              { value: '120', label: '办公室' },
              { value: '119', label: '宿舍' },
              { value: '128', label: '储物间' }
            ].map(option => (
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
            label="请选择"
            value={searchParams.unitId}
            onChange={handleSelectChange('unitId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: dialogValue.id, label: '当前楼栋单元' },
              { value: '', label: '全部楼栋单元' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
            setSearchParams({ state: '', roomSubType: '', unitId: '' })
            fetchData({
              state: '',
              roomSubType: '',
              unitId: '',
              'page.num': page.num,
              'page.size': page.size
            })
          }}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
