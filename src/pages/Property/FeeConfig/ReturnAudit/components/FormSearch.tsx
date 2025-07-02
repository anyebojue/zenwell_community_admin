import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReturnPayFeeParams } from 'api/model/property/feeConfig/returnPayFeeModel'
import { find } from 'modules/property/feeConfig/returnPayFee'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

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

const FormSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const [searchParams, setSearchParams] = useState<ReturnPayFeeParams>({
    applyPersonName: '',
    auditPersonName: '',
    payerObjId: '',
    stateCd: '',
    feeTypeCd: '',
    startTime: '',
    endTime: ''
  })

  const handleInputChange = useCallback(
    (field: keyof ReturnPayFeeParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (params: ReturnPayFeeParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params, is_export: true })
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
      applyPersonName: '',
      auditPersonName: '',
      payerObjId: '',
      stateCd: '',
      feeTypeCd: '',
      startTime: '',
      endTime: ''
    }
    setSearchParams(initialParams)
    fetchData({ ...initialParams, 'page.num': page.num, 'page.size': page.size })
  }, [fetchData, page.num, page.size])

  const handleSelectChange =
    (field: keyof ReturnPayFeeParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            size="small"
            label="请输入申请人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.applyPersonName}
            onChange={handleInputChange('applyPersonName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入审核人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.auditPersonName}
            onChange={handleInputChange('auditPersonName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入房屋编号 车辆编号等"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.payerObjId}
            onChange={handleInputChange('payerObjId')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择审核状态"
            value={searchParams.stateCd}
            onChange={handleSelectChange('stateCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1000', label: '审核中' },
              { value: '1100', label: '审核通过' },
              { value: '1200', label: '审核未通过' },
              { value: '1300', label: '退款单' }
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
            label="请选择选择费用类型"
            value={searchParams.feeTypeCd}
            onChange={handleSelectChange('feeTypeCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {list.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              ampm={false}
              label="申请开始时间"
              value={searchParams.startTime ? dayjs(searchParams.startTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formatted = dayjs(newValue).format('YYYY-MM-DD HH:mm:ss')
                  setSearchParams(prev => ({ ...prev, startTime: formatted }))
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    ...textFieldStyles,
                    '& .MuiSvgIcon-root': { fontSize: 17 }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              ampm={false}
              label="申请结束时间"
              value={searchParams.endTime ? dayjs(searchParams.endTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formatted = dayjs(newValue).format('YYYY-MM-DD HH:mm:ss')
                  setSearchParams(prev => ({ ...prev, endTime: formatted }))
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    ...textFieldStyles,
                    '& .MuiSvgIcon-root': { fontSize: 17 }
                  }
                }
              }}
            />
          </LocalizationProvider>
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
