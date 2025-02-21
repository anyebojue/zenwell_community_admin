import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeDetailParams } from 'api/model/property/feeConfig/payFeeDetailModel'
import { find } from 'modules/property/feeConfig/payFeeDetail'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

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
  const { page } = useSelector((state: RootState) => state.MeterTypeSlice)
  const [searchParams, setSearchParams] = useState<PayFeeDetailParams>({
    startTime: '',
    endTime: ''
  })

  const fetchData = useCallback(
    async (params: PayFeeDetailParams & PaginationParams) => {
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

  const handleInputChange =
    (field: keyof PayFeeDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form">
        <FormControl variant="outlined">
          <TextField
            size="small"
            label="请输入申请开始时间"
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
        <FormControl variant="outlined">
          <TextField
            size="small"
            label="请输入申请结束时间"
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
        <Stack sx={{ ml: 2 }} direction="row" spacing={1}>
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
