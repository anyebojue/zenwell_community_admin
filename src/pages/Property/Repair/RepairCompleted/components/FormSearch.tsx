import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolParams } from 'api/model/property/repairPoolModel'
import { find } from 'modules/property/repairPool'
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
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)

  const [searchParams, setSearchParams] = useState<RepairPoolParams>({
    id: '',
    repairName: '',
    tel: '',
    repairSettingId: '',
    statusCd: 0,
    maintenanceType: 0
  })

  const handleInputChange =
    (field: keyof RepairPoolParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: RepairPoolParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params, statusCd: 1900 })
        )
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        closeLoading()
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch, page.num, page.size]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入工单编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入报修人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.repairName}
            onChange={handleInputChange('repairName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入报修电话"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.tel}
            onChange={handleInputChange('tel')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择报修类型"
            value={searchParams.repairSettingId || ''}
            onChange={handleInputChange('repairSettingId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {list.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.repairTypeName}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择报修状态"
            value={searchParams.statusCd || ''}
            onChange={handleInputChange('statusCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 1000, label: '未派单' },
              { value: 1100, label: '接单' },
              { value: 1200, label: '退单' },
              { value: 1300, label: '转单' },
              { value: 1400, label: '申请支付' },
              { value: 1500, label: '支付失败' },
              { value: 1700, label: '待评价' },
              { value: 1800, label: '电话回访' },
              { value: 1900, label: '办理完成' },
              { value: 2000, label: '未办理结单' },
              { value: 2001, label: '暂停' }
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
            label="请选择维修类型"
            value={searchParams.maintenanceType || ''}
            onChange={handleInputChange('maintenanceType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1001', label: '有偿服务' },
              { value: '1002', label: '无偿服务' },
              { value: '1003', label: '需要用料' },
              { value: '1004', label: '无需用科' }
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
              id: '',
              repairName: '',
              tel: '',
              repairSettingId: '',
              statusCd: 0,
              maintenanceType: 0
            })
            fetchData({
              id: '',
              repairName: '',
              tel: '',
              repairSettingId: '',
              statusCd: 0,
              maintenanceType: 0,
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
