import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationParams } from 'api/model/property/communitys/roomRenovationModel'
import { find } from 'modules/property/communitys/communityAnnouncement'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
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

interface FormSearchProps {
  selectedButton: string
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CommunityAnnouncementSlice)
  const [searchParams, setSearchParams] = useState<RoomRenovationParams>({
    startTime: '',
    endTime: ''
  })

  const handleInputChange =
    (field: keyof RoomRenovationParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: RoomRenovationParams & PaginationParams) => {
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
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        {selectedButton === '1' ? (
          <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
            <TextField
              size="small"
              label="请输入业主姓名"
              type="text"
              variant="outlined"
              sx={textFieldStyles}
              value={searchParams.id}
              onChange={handleInputChange('id')}
            />
          </FormControl>
        ) : (
          <>
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <TextField
                size="small"
                label="请输入开始时间"
                type="date"
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
                label="请输入结束时间"
                type="date"
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
          </>
        )}
        {(selectedButton === '3' || selectedButton === '4') && (
          <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
            <TextField
              size="small"
              label="请输入账户名称"
              type="text"
              variant="outlined"
              sx={textFieldStyles}
              value={searchParams.id}
              onChange={handleInputChange('id')}
            />
          </FormControl>
        )}
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
              setSearchParams({ startTime: '', endTime: '' })
              fetchData({
                startTime: '',
                endTime: '',
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
