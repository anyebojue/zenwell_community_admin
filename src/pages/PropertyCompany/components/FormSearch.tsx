import { ChangeEvent, Dispatch, memo, SetStateAction, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyCompanyParams } from 'api/model/propertyCompanyModel'
import { find } from 'modules/propertyCompany'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
import { Add, Delete, History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormDialog from './FormDialog'

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
  const { page } = useSelector((state: RootState) => state.PropertyCompanySlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<PropertyCompanyParams>({
    id: '',
    name: '',
    tel: ''
  })

  const handleInputChange =
    (field: keyof PropertyCompanyParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (params: PropertyCompanyParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size, ...params }))
      } catch {
        message.error('列表加载失败，请刷新页面或检查网络问题')
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
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入物业编号"
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
            label="请输入名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.name}
            onChange={handleInputChange('name')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入电话"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.tel}
            onChange={handleInputChange('tel')}
          />
        </FormControl>
      </Stack>
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
          onClick={() => {
            setSearchParams({ id: '', name: '', tel: '' })
            fetchData({
              id: '',
              name: '',
              tel: '',
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
          startIcon={<Add />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => setOpenDialog(true)}
        >
          新增
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
      <FormDialog openDialog={openDialog} dialogType="add" setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(FormSearch)
