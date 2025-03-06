import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryPayFeeDetailParams } from 'api/model/property/report/queryPayFeeDetailModel'
import { find } from 'modules/property/report/queryPayFeeDetail'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

const formatDateTime = (date: Date | string | undefined): string => {
  const validDate = date ? new Date(date) : new Date()
  const year = validDate.getFullYear()
  const month = String(validDate.getMonth() + 1).padStart(2, '0')
  const day = String(validDate.getDate()).padStart(2, '0')
  const hours = String(validDate.getHours()).padStart(2, '0')
  const minutes = String(validDate.getMinutes()).padStart(2, '0')
  const seconds = String(validDate.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

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
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [searchParams, setSearchParams] = useState<QueryPayFeeDetailParams>({
    startTime: formatDateTime(new Date()),
    endTime: formatDateTime(new Date()),
    primeRate: '',
    state: '',
    payerObjName: '',
    feeTypeCd: '',
    configId: '',
    feeStartTime: '',
    feeEndTime: '',
    communityId: ''
  })

  const handleInputChange =
    (field: keyof QueryPayFeeDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
    fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载收费类型列表，请稍后...')
    fetchData(findFeeConfig, { 'page.disable': true }, '正在加载收费项列表，请稍后...')
  }, [fetchData])

  useEffect(() => {
    if (searchParams.feeTypeCd) {
      fetchData(
        findFeeConfig,
        { 'page.disable': true, feeTypeCd: searchParams.feeTypeCd },
        '正在加载收费项列表，请稍后...'
      )
    }
  }, [fetchData, searchParams.feeTypeCd])

  const handleSearch = () => {
    fetchData(
      find,
      { ...searchParams, 'page.num': page.num, 'page.size': page.size },
      '正在搜索，请稍后...'
    )
  }

  const handleSelectChange =
    (field: keyof QueryPayFeeDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            label="请选择缴费开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.startTime}
            onChange={handleInputChange('startTime')}
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
            label="请选择缴费结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.endTime}
            onChange={handleInputChange('endTime')}
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
            label="请选择支付方式"
            value={searchParams.primeRate}
            onChange={handleSelectChange('primeRate')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1', label: '现金' },
              { value: '2', label: 'POS刷卡' },
              { value: '3', label: '微信二维码' },
              { value: '4', label: '支付宝二维码' },
              { value: '5', label: '微信公众号支付' },
              { value: '6', label: '微信小程序支付' },
              { value: '7', label: '转账' },
              { value: '8', label: '押金退款到账户' }
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
            label="请选择费用状态"
            value={searchParams.state}
            onChange={handleSelectChange('state')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1000', label: '退费中' },
              { value: '1100', label: '已退费' },
              { value: '1200', label: '退费失败' },
              { value: '1300', label: '退费单' },
              { value: '1400', label: '正常' },
              { value: '1500', label: '欠费' }
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
            label="请输入房屋编号或者车辆号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.payerObjName}
            onChange={handleInputChange('payerObjName')}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择收费类型"
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
            label="请选择收费开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.feeStartTime}
            onChange={handleInputChange('feeStartTime')}
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
            label="请选择收费结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.feeEndTime}
            onChange={handleInputChange('feeEndTime')}
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
            value={searchParams.communityId}
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
              startTime: formatDateTime(new Date()),
              endTime: formatDateTime(new Date()),
              primeRate: '',
              state: '',
              payerObjName: '',
              feeTypeCd: '',
              configId: '',
              feeStartTime: '',
              feeEndTime: '',
              communityId: ''
            })
            fetchData(
              find,
              {
                startTime: formatDateTime(new Date()),
                endTime: formatDateTime(new Date()),
                primeRate: '',
                state: '',
                payerObjName: '',
                feeTypeCd: '',
                configId: '',
                feeStartTime: '',
                feeEndTime: '',
                communityId: ''
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
