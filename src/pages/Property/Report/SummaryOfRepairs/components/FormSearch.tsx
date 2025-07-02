import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryRepairParams } from 'api/model/property/report/queryRepairModel'
import { find } from 'modules/property/report/queryRepair'
import { find as findEmployee } from 'modules/platform/organization/employees'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

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

interface SearchFormProps {}

const FormSearch: React.FC<SearchFormProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page } = useSelector((state: RootState) => state.QueryRepairSlice)
  const { list: employeeList } = useSelector((state: RootState) => state.EmployeesSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  const [searchParams, setSearchParams] = useState<QueryRepairParams>({
    beginStartTime: '',
    beginEndTime: '',
    finishStartTime: '',
    finishEndTime: '',
    communityId: community?.id,
    staffId: '',
    state: ''
  })

  const handleInputChange =
    (field: keyof QueryRepairParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (
      action: Function,
      params: Record<string, boolean | string | number>,
      loadingMessage: string
    ) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        return res
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(findEmployee, { 'page.disable': true }, '正在加载员工列表，请稍后...')
  }, [fetchData])

  const handleSearch = () => {
    fetchData(
      find,
      { ...searchParams, 'page.num': page.num, 'page.size': page.size },
      '正在搜索，请稍后...'
    )
  }

  const handleSelectChange =
    (field: keyof QueryRepairParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            label="请选择创建开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.beginStartTime}
            onChange={handleInputChange('beginStartTime')}
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
            label="请选择创建结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.beginEndTime}
            onChange={handleInputChange('beginEndTime')}
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
            label="请选择完结开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.finishStartTime}
            onChange={handleInputChange('finishStartTime')}
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
            label="请选择完结结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.finishEndTime}
            onChange={handleInputChange('finishEndTime')}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择小区"
            value={searchParams.communityId || community?.id}
            onChange={handleSelectChange('communityId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {info.community.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择员工"
            value={searchParams.staffId}
            onChange={handleSelectChange('staffId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {employeeList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.username}
              </MenuItem>
            ))}
          </TextField>
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
              { value: '10001', label: '处理中' },
              { value: '10002', label: '结单' },
              { value: '10003', label: '退单' },
              { value: '10004', label: '转单' },
              { value: '10006', label: '已派单' },
              { value: '10007', label: '已评价' },
              { value: '10008', label: '已回访' },
              { value: '10009', label: '待支付' },
              { value: '11000', label: '待评价' },
              { value: '12000', label: '已支付' },
              { value: '12001', label: '暂停' },
              { value: '12002', label: '启动' },
              { value: '10010', label: '评价回复' }
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
            setSearchParams({
              beginStartTime: '',
              beginEndTime: '',
              finishStartTime: '',
              finishEndTime: '',
              communityId: '',
              staffId: '',
              state: ''
            })
            fetchData(
              find,
              {
                beginStartTime: '',
                beginEndTime: '',
                finishStartTime: '',
                finishEndTime: '',
                communityId: '',
                staffId: '',
                state: ''
              },
              '正在重置，请稍后...'
            )
          }}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
