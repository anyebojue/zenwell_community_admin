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
  const { page } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const { list: floorList } = useSelector((state: RootState) => state.HousingManagementSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const { list: feeList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const [searchParams, setSearchParams] = useState<ReturnPayFeeParams>({
    floorId: '',
    unitId: '',
    roomNum: '',
    feeId: '',
    state: '',
    payerObjType: '',
    startTime: '',
    endTime: '',
    detailState: ''
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
      floorId: '',
      unitId: '',
      roomNum: '',
      feeId: '',
      state: '',
      payerObjType: '',
      startTime: '',
      endTime: '',
      detailState: ''
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
            select
            size="small"
            label="请选择楼栋"
            value={searchParams.floorId}
            onChange={handleSelectChange('floorId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {floorList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.floorNum}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择单元"
            value={searchParams.unitId}
            onChange={handleSelectChange('unitId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {unitList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.unitNum}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入房屋编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.roomNum}
            onChange={handleInputChange('roomNum')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择费用项名称"
            value={searchParams.feeId}
            onChange={handleSelectChange('feeId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {feeList
              .filter(option => option.name === '押金')
              .map(option => (
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
            label="请选择退费状态"
            value={searchParams.detailState}
            onChange={handleSelectChange('detailState')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1000', label: '退费中' },
              { value: '1100', label: '已退费' },
              { value: '1200', label: '退费失败' },
              { value: '1400', label: '正常' },
              { value: '1500', label: '欠费' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择收费状态"
            value={searchParams.state}
            onChange={handleSelectChange('state')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '2007001', label: '收费未开始' },
              { value: '2008001', label: '有效' },
              { value: '2009001', label: '收费结束' }
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
            label="请选择收费对象"
            value={searchParams.payerObjType}
            onChange={handleSelectChange('payerObjType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '3333', label: '房屋' },
              { value: '6666', label: '停车位' },
              { value: '7777', label: '合同' }
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
            label="请输入费用创建开始时间"
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
            label="请输入费用创建结束时间"
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
