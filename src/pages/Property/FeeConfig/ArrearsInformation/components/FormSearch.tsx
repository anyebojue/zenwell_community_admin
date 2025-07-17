import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportOweFeeParams } from 'api/model/property/feeConfig/reportOweFeeModel'
import { find } from 'modules/property/feeConfig/reportOweFee'
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
  const { page } = useSelector((state: RootState) => state.ReportOweFeeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const [searchParams, setSearchParams] = useState<ReportOweFeeParams>({
    floorId: '',
    floorNum: '',
    unitId: '',
    unitNum: '',
    payerObjName: '',
    roomSubType: '',
    configId: '',
    configName: '',
    ownerName: '',
    payerObjType: ''
  })

  const handleInputChange = useCallback(
    (field: keyof ReportOweFeeParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (params: ReportOweFeeParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...params,
            floorNum: floorList.filter(item => item.id === searchParams.floorId)[0]?.floorNum || '',
            unitNum: unitList.filter(item => item.id === searchParams.unitId)[0]?.unitNum || '',
            configName:
              feeConfigList.filter(item => item.id === searchParams.configId)[0]?.name || '',
            is_export: true
          })
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
    [dispatch, floorList, page.num, page.size, searchParams.floorId, searchParams.unitId, unitList]
  )

  const handleSearch = useCallback(() => {
    fetchData({ ...searchParams })
  }, [fetchData, searchParams])

  const handleReset = useCallback(() => {
    const initialParams = {
      floorId: '',
      floorNum: '',
      unitId: '',
      unitNum: '',
      payerObjName: '',
      roomSubType: '',
      configId: '',
      configName: '',
      ownerName: '',
      payerObjType: ''
    }
    setSearchParams(initialParams)
    fetchData({ ...initialParams, 'page.num': page.num, 'page.size': page.size })
  }, [fetchData, page.num, page.size])

  const handleSelectChange =
    (field: keyof ReportOweFeeParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            onChange={handleInputChange('floorId')}
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
            onChange={handleInputChange('unitId')}
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
            value={searchParams.payerObjName}
            onChange={handleInputChange('payerObjName')}
          />
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
            label="请选择选择费用项"
            value={searchParams.configId}
            onChange={handleSelectChange('configId')}
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
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入业主名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.ownerName}
            onChange={handleInputChange('ownerName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择付费对象类型"
            value={searchParams.payerObjType}
            onChange={handleSelectChange('payerObjType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '3333', label: '房屋' },
              { value: '6666', label: '车位' },
              { value: '9999', label: '合同' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
