import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeCollectionOrderParams } from 'api/model/property/feeConfig/feeCollectionOrderModel'
import { find } from 'modules/property/feeConfig/feeCollectionOrder'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
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
  const [searchParams, setSearchParams] = useState<FeeCollectionOrderParams>({
    name: '',
    statusCd: ''
  })

  const fetchData = useCallback(
    async (params: FeeCollectionOrderParams & PaginationParams) => {
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

  const handleInputChange = useCallback(
    (field: keyof FeeCollectionOrderParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const handleSelectChange =
    (field: keyof FeeCollectionOrderParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form">
        <FormControl>
          <TextField
            size="small"
            label="请输入账单名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.name}
            onChange={handleInputChange('name')}
          />
        </FormControl>
        <FormControl variant="outlined">
          <TextField
            select
            size="small"
            label="请选择账单类型"
            value={searchParams.statusCd}
            onChange={handleSelectChange('statusCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 'T', label: '当前账单' },
              { value: 'F', label: '往期账单' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
              setSearchParams({ name: '', statusCd: '' })
              fetchData({
                name: '',
                statusCd: '',
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
