import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryOweFeeDetailParams } from 'api/model/property/report/queryOweFeeDetailModel'
import { find } from 'modules/property/report/queryOweFeeDetail'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
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
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page } = useSelector((state: RootState) => state.QueryOweFeeDetailSlice)
  const { list: floorList } = useSelector((state: RootState) => state.HousingManagementSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)

  const [searchParams, setSearchParams] = useState<QueryOweFeeDetailParams>({
    floorId: '',
    unitId: '',
    roomNum: '',
    startTime: '',
    endTime: '',
    communityId: ''
  })

  const handleInputChange =
    (field: keyof QueryOweFeeDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
    fetchData(findFloor, { 'page.disable': true }, '正在加载楼栋列表，请稍后...')
  }, [fetchData])

  useEffect(() => {
    if (searchParams.floorId) {
      fetchData(
        findUnit,
        { 'page.disable': true, floorId: searchParams.floorId },
        '正在加载单元列表，请稍后...'
      )
    }
  }, [fetchData, searchParams.floorId])

  const handleSearch = () => {
    fetchData(
      find,
      { ...searchParams, 'page.num': page.num, 'page.size': page.size },
      '正在搜索，请稍后...'
    )
  }

  const handleSelectChange =
    (field: keyof QueryOweFeeDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            size="small"
            label="请输入创建开始时间"
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
            label="请输入创建结束时间"
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
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
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
              floorId: '',
              unitId: '',
              roomNum: '',
              startTime: '',
              endTime: '',
              communityId: ''
            })
            fetchData(
              find,
              {
                floorId: '',
                unitId: '',
                roomNum: '',
                startTime: '',
                endTime: '',
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
