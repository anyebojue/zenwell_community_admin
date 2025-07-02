import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryReportOwnerPayFeeParams } from 'api/model/property/report/queryReportOwnerPayFeeModel'
import { find } from 'modules/property/report/queryReportOwnerPayFee'
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
  const { page } = useSelector((state: RootState) => state.QueryReportOwnerPayFeeSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [searchParams, setSearchParams] = useState<QueryReportOwnerPayFeeParams>({
    feeTypeCd: '',
    configId: '',
    roomName: '',
    ownerName: '',
    pfYear: ''
  })

  const handleInputChange = useCallback(
    (field: keyof QueryReportOwnerPayFeeParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (params: QueryReportOwnerPayFeeParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params })
        )
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch, page.num, page.size]
  )

  const handleSearch = useCallback(() => {
    fetchData({ ...searchParams })
  }, [fetchData, searchParams])

  const handleReset = useCallback(() => {
    const initialParams = { feeTypeCd: '', configId: '', roomName: '', ownerName: '', pfYear: '' }
    setSearchParams(initialParams)
    fetchData({ ...initialParams, 'page.num': page.num, 'page.size': page.size })
  }, [fetchData, page.num, page.size])

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择收费大类"
            value={searchParams.feeTypeCd}
            onChange={handleInputChange('feeTypeCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {feeConfigTypeList.map(option => (
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
            label="请选择收费项"
            value={searchParams.configId}
            onChange={handleInputChange('configId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {feeConfigList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请填写房屋编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.roomName}
            onChange={handleInputChange('roomName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请填写业主姓名"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.ownerName}
            onChange={handleInputChange('ownerName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请填写年份"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.pfYear}
            onChange={handleInputChange('pfYear')}
          />
        </FormControl>
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
          onClick={handleReset}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
