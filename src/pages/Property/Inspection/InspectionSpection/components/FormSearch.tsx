import { ChangeEvent, Dispatch, memo, SetStateAction, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpectionItemParams } from 'api/model/property/spectionItemModel'
import { find } from 'modules/property/spectionItem'
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
  const { page } = useSelector((state: RootState) => state.SpectionItemSlice)

  const [searchParams, setSearchParams] = useState<SpectionItemParams>({
    id: '',
    name: '',
    titleType: 0
  })

  const handleInputChange =
    (field: keyof SpectionItemParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: SpectionItemParams & PaginationParams) => {
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

  const handleSelectChange =
    (field: keyof SpectionItemParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            label="请输入项目编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入巡检项目"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.name}
            onChange={handleInputChange('name')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择题目类型"
            value={searchParams.titleType || ''}
            onChange={handleSelectChange('titleType')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 1001, label: '单选' },
              { value: 2002, label: '多选' },
              { value: 3003, label: '简答题' }
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
              setSearchParams({ id: '', name: '', titleType: 0 })
              fetchData({
                id: '',
                name: '',
                titleType: 0,
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
