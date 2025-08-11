import {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useState,
  useCallback,
  useEffect
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ResourceStoreSpecificationParams } from 'api/model/property/purchase/resourceStoreSpecificationModel'
import { find } from 'modules/property/purchase/resourceStoreSpecification'
import { find as findStoreType } from 'modules/property/purchase/resourceStoreType'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
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
  const { page } = useSelector((state: RootState) => state.ResourceStoreSpecificationSlice)
  const { list: storeList } = useSelector((state: RootState) => state.StoreTypeSlice)
  const { list: storeTypeList } = useSelector((state: RootState) => state.ResourceStoreTypeSlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [searchParams, setSearchParams] = useState<ResourceStoreSpecificationParams>({
    storeId: '',
    rstId: '',
    specName: '',
    id: ''
  })

  const handleInputChange = useCallback(
    (field: keyof ResourceStoreSpecificationParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  const handleSearch = useCallback(() => {
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, ...searchParams },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, searchParams])

  const handleReset = useCallback(() => {
    const initialParams = { storeId: '', rstId: '', specName: '', id: '' }
    setSearchParams(initialParams)
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, ...initialParams },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleBatchDelete = useCallback(() => {
    if (selectedRows.size === 0) {
      message.warning('请选择至少一项')
      return
    }
    setDelOpen(true)
  }, [selectedRows.size, setDelOpen])

  const handleSelectChange =
    (field: keyof ResourceStoreSpecificationParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  useEffect(() => {
    if (searchParams.storeId) {
      fetchData(
        findStoreType,
        { 'page.num': page.num, 'page.size': page.size, storeId: searchParams.storeId },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams.storeId])

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择物品类型"
            value={searchParams.storeId}
            onChange={handleSelectChange('storeId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {storeList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择二级分类"
            value={searchParams.rstId}
            onChange={handleSelectChange('rstId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {storeTypeList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入规格名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.specName}
            onChange={handleInputChange('specName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入规格编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
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
          onClick={handleReset}
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
          onClick={handleBatchDelete}
        >
          批量删除
        </Button>
      </Stack>
      <FormDialog openDialog={openDialog} dialogType="add" setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(FormSearch)
