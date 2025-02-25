import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeDiscountParams } from 'api/model/property/feeConfig/feeDiscountModel'
import { find } from 'modules/property/feeConfig/feeDiscount'
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
  const { page, list } = useSelector((state: RootState) => state.FeeConfigTypeSlice)

  const [searchParams, setSearchParams] = useState<FeeDiscountParams>({
    discountType: ''
  })

  const fetchData = useCallback(
    async (params: FeeDiscountParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, ...params })
        )
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch, page.num, page.size]
  )

  const handleSearch = useCallback(() => {
    fetchData({ ...searchParams })
  }, [fetchData, searchParams])

  const handleReset = useCallback(() => {
    const initialParams = { name: '', tel: '' }
    setSearchParams(initialParams)
    fetchData({ ...initialParams, 'page.num': page.num, 'page.size': page.size })
  }, [fetchData, page.num, page.size])

  const handleSelectChange =
    (field: keyof FeeDiscountParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择折扣类型"
            value={searchParams.discountType}
            onChange={handleSelectChange('discountType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {list.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <Stack direction="row" spacing={1} component="form" sx={{ mb: 2 }}>
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
            onClick={handleReset}
          >
            重置
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
