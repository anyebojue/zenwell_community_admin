import { ChangeEvent, Dispatch, memo, SetStateAction, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairSettingParams } from 'api/model/property/repairSettingModel'
import { find } from 'modules/property/repairSetting'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Delete, History, Search } from '@mui/icons-material'
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

interface SearchFormProps {
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<SearchFormProps> = ({ selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairSettingSlice)

  const [searchParams, setSearchParams] = useState<RepairSettingParams>({
    repairTypeName: '',
    repairWay: 0,
    repairType: '',
    publicArea: 0,
    returnVisitFlag: 0
  })

  const handleInputChange =
    (field: keyof RepairSettingParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: RepairSettingParams & PaginationParams) => {
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
            label="请输入员工姓名"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.repairTypeName}
            onChange={handleInputChange('repairTypeName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择派单方式"
            value={searchParams.repairWay || ''}
            onChange={handleInputChange('repairWay')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 100, label: '抢单' },
              { value: 200, label: '指派' },
              { value: 300, label: '轮训' }
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
            label="请选择报修设置类型"
            value={searchParams.repairType}
            onChange={handleInputChange('repairType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1', label: '维修单' },
              { value: '2', label: '保洁单' }
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
            label="请选择区域"
            value={searchParams.publicArea || ''}
            onChange={handleInputChange('publicArea')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 0, label: '非房屋' },
              { value: 1, label: '房屋' }
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
            label="请选择是否回访"
            value={searchParams.returnVisitFlag || ''}
            onChange={handleInputChange('returnVisitFlag')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 1, label: '不回访' },
              { value: 2, label: '已评价不回访' },
              { value: 3, label: '回访' }
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
                repairTypeName: '',
                repairWay: 0,
                repairType: '',
                publicArea: -1,
                returnVisitFlag: 0
              })
              fetchData({
                repairTypeName: '',
                repairWay: 0,
                repairType: '',
                publicArea: -1,
                returnVisitFlag: 0,
                'page.num': page.num,
                'page.size': page.size
              })
            }}
          >
            重置
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={buttonStyles('#B22222', '#8B0000')}
            onClick={() => {
              if (![...selectedRows].length) {
                return message.warning('请选择至少一项')
              }
              setDelOpen(true)
            }}
          >
            批量删除
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
