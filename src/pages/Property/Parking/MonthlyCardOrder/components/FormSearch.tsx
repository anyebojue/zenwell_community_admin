import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChargeMonthOrderParams } from 'api/model/property/parking/chargeMonthOrderModel'
import { find } from 'modules/property/parking/chargeMonthOrder'
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
  const { page } = useSelector((state: RootState) => state.ChargeMonthOrderSlice)
  const { list } = useSelector((state: RootState) => state.ChargeMonthCardSlice)

  const [searchParams, setSearchParams] = useState<ChargeMonthOrderParams>({
    cardId: '',
    carNum: '',
    primeRate: '',
    statusCd: '',
    startTime: '',
    endTime: ''
  })

  const handleInputChange = useCallback(
    (field: keyof ChargeMonthOrderParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (params: ChargeMonthOrderParams & PaginationParams) => {
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
    const initialParams = {
      cardId: '',
      carNum: '',
      primeRate: '',
      statusCd: '',
      startTime: '',
      endTime: ''
    }
    fetchData({ ...initialParams, 'page.num': page.num, 'page.size': page.size })
  }, [fetchData, page.num, page.size])

  const handleSelectChange =
    (field: keyof ChargeMonthOrderParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择月卡"
            value={searchParams.cardId}
            onChange={handleSelectChange('cardId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {list.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.cardName}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入车牌号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.carNum}
            onChange={handleInputChange('carNum')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择支付方式"
            value={searchParams.primeRate}
            onChange={handleInputChange('primeRate')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { label: '现金', value: '1' },
              { label: 'POS刷卡', value: '2' },
              { label: '微信二维码', value: '3' },
              { label: '支付宝二维码', value: '4' },
              { label: '转账', value: '7' }
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
            label="请选择车位状态"
            value={searchParams.statusCd}
            onChange={handleInputChange('statusCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1', label: '正常' },
              { value: '3', label: '到期' },
              { value: '2', label: '无车位' }
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
            label="请选择结束时间"
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
