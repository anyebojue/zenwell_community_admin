import { ChangeEvent, memo, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MeterWaterParams } from 'api/model/property/feeConfig/meterWaterModel'
import { find } from 'modules/property/feeConfig/meterWater'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Delete, History, Search } from '@mui/icons-material'
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

interface SearchFormProps {
  selectedRows: Set<string | undefined>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const FormSearch: React.FC<SearchFormProps> = ({ selectedRows, setDelOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.MeterWaterSlice)
  const { list } = useSelector((state: RootState) => state.MeterTypeSlice)
  const [searchParams, setSearchParams] = useState<MeterWaterParams>({
    meterType: ''
  })

  const fetchData = useCallback(
    async (params: MeterWaterParams & PaginationParams) => {
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

  const handleSelectChange =
    (field: keyof MeterWaterParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const handleBatchDelete = useCallback(() => {
    if (selectedRows.size === 0) {
      message.warning('请选择至少一项')
      return
    }
    setDelOpen(true)
  }, [selectedRows.size, setDelOpen])

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form">
        <FormControl variant="outlined">
          <TextField
            select
            size="small"
            label="请选择表类型"
            value={searchParams.meterType}
            onChange={handleSelectChange('meterType')}
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
              setSearchParams({ meterType: '' })
              fetchData({
                meterType: '',
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
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
