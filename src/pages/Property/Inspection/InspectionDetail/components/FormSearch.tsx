import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionTaskDetailParams } from 'api/model/property/inspection/spectionTaskDetailModel'
import { find } from 'modules/property/inspection/spectionTaskDetail'
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
  const { page } = useSelector((state: RootState) => state.RepairSettingSlice)

  const [searchParams, setSearchParams] = useState<SpectionTaskDetailParams>({
    inspectionId: '',
    taskId: '',
    inspectionState: 0,
    stateCd: 0,
    patrolType: 0
  })

  const handleInputChange =
    (field: keyof SpectionTaskDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: SpectionTaskDetailParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params })
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
            label="请输入巡检人"
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
            label="请选择实际巡检开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.inspectionId}
            onChange={handleInputChange('inspectionId')}
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
            label="请选择实际巡检结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.inspectionId}
            onChange={handleInputChange('inspectionId')}
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
            label="请输入任务详情ID"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择巡检计划"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[{ value: '1001', label: 'HRS巡检' }].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择巡检路线"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[{ value: '1001', label: '1号1栋路线' }].map(option => (
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
            label="请选择巡检点"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[{ value: '1001', label: '小区道路' }].map(option => (
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
            label="请选择签到状态"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '40000', label: '早到' },
              { value: '50000', label: '迟到' },
              { value: '60000', label: '准时' },
              { value: '70000', label: '未到' }
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
            label="请选择巡检点状态"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '20200405', label: '未开始' },
              { value: '20200406', label: '巡检中' },
              { value: '20200407', label: '巡检完成' },
              { value: '20200408', label: '已超时' },
              { value: '20200409', label: '缺勤' }
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
            label="请选择任务状态"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '20200405', label: '未开始' },
              { value: '20200406', label: '巡检中' },
              { value: '20200407', label: '巡检完成' },
              { value: '20200408', label: '巡检未完成' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择巡检情况"
            value={searchParams.inspectionId || ''}
            onChange={handleInputChange('inspectionId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '10001', label: '巡检正常' },
              { value: '20002', label: '巡检异常' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
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
                inspectionId: '',
                taskId: '',
                inspectionState: 0,
                stateCd: 0,
                patrolType: 0
              })
              fetchData({
                inspectionId: '',
                taskId: '',
                inspectionState: 0,
                stateCd: 0,
                patrolType: 0,
                'page.num': page.num,
                'page.size': page.size
              })
            }}
          >
            重置
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
