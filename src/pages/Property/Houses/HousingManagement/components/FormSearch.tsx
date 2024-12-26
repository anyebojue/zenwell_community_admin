import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply, OrgUserReply } from 'api/model/platform/organizationInfoModel'
import { findOrgUser } from 'modules/platform/organizationInfo'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { CommunityParams } from 'api/model/platform/communityModel'

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
  dialogValue: OrganizationInfoReply
}

const FormSearch: React.FC<FormSearchProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [searchParams, setSearchParams] = useState<OrgUserReply>({
    name: ''
  })

  const handleInputChange =
    (field: keyof OrgUserReply) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: OrgUserReply & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          findOrgUser({
            'page.num': page.num,
            'page.size': page.size,
            ...params,
            orgId: dialogValue.id || '9027438861059358721'
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
    [dispatch, page.num, page.size, dialogValue.id]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  const handleSelectChange =
    (field: keyof CommunityParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            value={searchParams.name}
            onChange={handleInputChange('name')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择状态"
            value={searchParams.name}
            onChange={handleSelectChange('name')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 0, label: '未销售' },
              { value: 1, label: '已入住' },
              { value: 2, label: '已交房' },
              { value: 3, label: '已装修' },
              { value: 4, label: '未入住' },
              { value: 5, label: '已出租' },
              { value: 6, label: '已出售' },
              { value: 7, label: '空闲' },
              { value: 8, label: '装修中' }
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
            value={searchParams.name}
            onChange={handleSelectChange('name')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 0, label: '住宅' },
              { value: 1, label: '办公室' },
              { value: 2, label: '宿舍' },
              { value: 3, label: '储物间' }
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
            value={searchParams.name}
            onChange={handleSelectChange('name')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 0, label: '当前楼栋单元' },
              { value: 1, label: '全部楼栋单元' }
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
            setSearchParams({ name: '', orgId: '9027438861059358721' })
            fetchData({
              name: '',
              orgId: '9027438861059358721',
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
