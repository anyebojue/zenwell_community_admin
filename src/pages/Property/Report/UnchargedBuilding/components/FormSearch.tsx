import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryNoFeeRoomsParams } from 'api/model/property/report/queryNoFeeRoomsModel'
import { find } from 'modules/property/report/queryNoFeeRooms'
import { find as findFloor } from 'modules/property/houses/housingManagement'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findRoom } from 'modules/property/houses/room'
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
  const { page } = useSelector((state: RootState) => state.ReportFeeYearCollectionSlice)
  const { list: floorList } = useSelector((state: RootState) => state.HousingManagementSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)

  const [searchParams, setSearchParams] = useState<QueryNoFeeRoomsParams>({
    floorId: '',
    unitId: '',
    roomId: '',
    ownerName: '',
    link: ''
  })

  const handleInputChange =
    (field: keyof QueryNoFeeRoomsParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
        { 'page.num': page.num, 'page.size': page.size, floorId: searchParams.floorId },
        '正在加载单元列表，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams])

  useEffect(() => {
    if (searchParams.unitId) {
      fetchData(
        findRoom,
        { 'page.num': page.num, 'page.size': page.size, unitId: searchParams.unitId },
        '正在加载房屋列表，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams])

  const handleSearch = () => {
    fetchData(
      find,
      { ...searchParams, 'page.num': page.num, 'page.size': page.size },
      '正在搜索，请稍后...'
    )
  }

  const handleSelectChange =
    (field: keyof QueryNoFeeRoomsParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            select
            size="small"
            label="请选择房屋"
            value={searchParams.roomId}
            onChange={handleSelectChange('roomId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {roomList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.roomNum}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
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
            size="small"
            label="请输入业主电话"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.link}
            onChange={handleInputChange('link')}
          />
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
              roomId: '',
              ownerName: '',
              link: ''
            })
            fetchData(
              find,
              {
                floorId: '',
                unitId: '',
                roomId: '',
                ownerName: '',
                link: '',
                'page.num': page.num,
                'page.size': page.size
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
