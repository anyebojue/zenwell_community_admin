import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/room'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RoomParams } from 'api/model/property/houses/roomModel'

const textFieldStyles = {
  width: '270px',
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
  const { page } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [searchParams, setSearchParams] = useState<RoomParams>({
    state: '',
    roomSubType: '',
    unitId: ''
  })

  const handleInputChange = (field: keyof RoomParams) => (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prevData => ({
      ...prevData,
      [field]: event.target.value
    }))
  }

  const fetchData = useCallback(
    async (params: RoomParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...params
          })
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
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={3} component="form">
        <FormControl variant="outlined">
          <TextField
            size="small"
            label="房屋编号，如1-1-1123"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.unitId}
            onChange={handleInputChange('unitId')}
          />
        </FormControl>
        <FormControl variant="outlined">
          <TextField
            size="small"
            label="请填写业主名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.unitId}
            onChange={handleInputChange('unitId')}
          />
        </FormControl>
        <Stack direction="row" spacing={1}>
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
              setSearchParams({ state: '', roomSubType: '', unitId: '' })
              fetchData({
                state: '',
                roomSubType: '',
                unitId: '',
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
