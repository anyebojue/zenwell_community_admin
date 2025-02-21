import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReturnPayFeeParams } from 'api/model/property/feeConfig/returnPayFeeModel'
import { find } from 'modules/property/feeConfig/returnPayFee'
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
          <TextField
            size="small"
            label="请输入申请开始时间"
            type="datetime-local"
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
            label="请输入申请结束时间"
            type="datetime-local"
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
