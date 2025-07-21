import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CarInoutParams } from 'api/model/property/parking/carInoutModel'
import { find } from 'modules/property/parking/carInout'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
  const { page } = useSelector((state: RootState) => state.CarInoutSlice)
  const [searchParams, setSearchParams] = useState<CarInoutParams>({
    carNum: '',
    stateCd: '',
    carType: '',
    startTime: '',
    endTime: ''
  })

  const handleInputChange =
    (field: keyof CarInoutParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: CarInoutParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { paId: selectedButton }),
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
    [dispatch, page.num, page.size, selectedButton]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  const handleSelectChange =
    (field: keyof CarInoutParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            size="small"
            label="请输入车牌号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.carNum}
            onChange={handleInputChange('carNum')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择审核状态"
            value={searchParams.stateCd}
            onChange={handleSelectChange('stateCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1010', label: '待审核' },
              { value: '2020', label: '审核通过' },
              { value: '3030', label: '审核未通过' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              ampm={false}
              label="申请开始时间"
              value={searchParams.startTime ? dayjs(searchParams.startTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formatted = dayjs(newValue).format('YYYY-MM-DD HH:mm:ss')
                  setSearchParams(prev => ({ ...prev, startTime: formatted }))
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    ...textFieldStyles,
                    '& .MuiSvgIcon-root': { fontSize: 17 }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              ampm={false}
              label="申请结束时间"
              value={searchParams.endTime ? dayjs(searchParams.endTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formatted = dayjs(newValue).format('YYYY-MM-DD HH:mm:ss')
                  setSearchParams(prev => ({ ...prev, endTime: formatted }))
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    ...textFieldStyles,
                    '& .MuiSvgIcon-root': { fontSize: 17 }
                  }
                }
              }}
            />
          </LocalizationProvider>
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
              setSearchParams({ carNum: '', stateCd: '', carType: '', startTime: '', endTime: '' })
              fetchData({
                carNum: '',
                stateCd: '',
                carType: '',
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
