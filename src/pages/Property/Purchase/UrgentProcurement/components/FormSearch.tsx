import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ResourceStoreParams } from 'api/model/property/purchase/resourceStoreModel'
import { find } from 'modules/property/purchase/resourceStore'
import { find as findStoreType } from 'modules/property/purchase/resourceStoreType'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { Search } from '@mui/icons-material'
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

interface FormSearchProps {}

const FormSearch: React.FC<FormSearchProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ResourceStoreSlice)
  const { list: storehouseList } = useSelector((state: RootState) => state.StorehouseSlice)
  const { list: storeList } = useSelector((state: RootState) => state.StoreTypeSlice)
  const { list: storeTypeList } = useSelector((state: RootState) => state.ResourceStoreTypeSlice)
  const [searchParams, setSearchParams] = useState<ResourceStoreParams>({
    shId: '',
    storeId: '',
    rstId: '',
    resName: ''
  })

  const handleInputChange =
    (field: keyof ResourceStoreParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  const fetchData = useCallback(
    async (
      action: Function,
      params: Record<string, boolean | string | number>,
      loadingMessage: string
    ) => {
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

  const handleSelectChange =
    (field: keyof ResourceStoreParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
      <Stack direction="row" spacing={3} sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '13ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择仓库"
            value={searchParams.shId}
            onChange={handleSelectChange('shId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {storehouseList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.shName}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '13ch' } }} variant="outlined">
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
        <FormControl sx={{ width: { xs: '100%', md: '13ch' } }} variant="outlined">
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
        <FormControl variant="outlined">
          <TextField
            size="small"
            label="请填写物品名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.resName}
            onChange={handleInputChange('resName')}
          />
        </FormControl>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Search />}
            sx={{ flexShrink: 0, ...buttonStyles('#2660ad', '#1d428a') }}
            onClick={handleSearch}
          >
            查询
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
