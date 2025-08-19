import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PurchaseApplyDetailParams } from 'api/model/property/purchase/purchaseApplyDetailModel'
import { find } from 'modules/property/purchase/purchaseApplyDetail'
import { find as findStoreType } from 'modules/property/purchase/resourceStoreType'
import { find as findSpecification } from 'modules/property/purchase/resourceStoreSpecification'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { ProcurementResourceStore } from 'api/model/property/purchase/businessPurchaseApplyModel'

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
  const { page } = useSelector((state: RootState) => state.PurchaseApplyDetailSlice)
  const { list: storehouseList } = useSelector((state: RootState) => state.StorehouseSlice)
  const { list: storeList } = useSelector((state: RootState) => state.StoreTypeSlice)
  const { list: storeTypeList } = useSelector((state: RootState) => state.ResourceStoreTypeSlice)
  const { list: storeSpecificationList } = useSelector(
    (state: RootState) => state.ResourceStoreSpecificationSlice
  )
  const [searchParams, setSearchParams] = useState<PurchaseApplyDetailParams>({
    id: '',
    statusCd: '',
    userName: '',
    endUserName: '',
    resName: '',
    warehousingWay: '',
    resOrderType: '',
    startTime: '',
    endTime: '',
    storeId: '',
    rstId: '',
    rssId: '',
    rsId: '',
    shId: ''
  })

  const handleInputChange = useCallback(
    (field: keyof PurchaseApplyDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const fetchData = useCallback(
    async (
      action: Function,
      params: Record<string, string | number | boolean | ProcurementResourceStore[]>,
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

  const handleReset = useCallback(() => {
    const initialParams = {
      shId: '',
      resName: '',
      resCode: '',
      storeId: '',
      rstId: '',
      rssId: '',
      id: '',
      isFixed: ''
    }
    setSearchParams(initialParams)
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, ...initialParams },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  const handleSelectChange =
    (field: keyof PurchaseApplyDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  useEffect(() => {
    if (searchParams.storeId) {
      fetchData(
        findStoreType,
        { 'page.disable': true, storeId: searchParams.storeId },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams.storeId])

  useEffect(() => {
    if (searchParams.rstId) {
      fetchData(
        findSpecification,
        { 'page.disable': true, rstId: searchParams.rstId },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams.rstId])

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入订单号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.id}
            onChange={handleInputChange('id')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择状态"
            value={searchParams.statusCd}
            onChange={handleInputChange('statusCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '1000', label: '未审核' },
              { value: '1001', label: '审核中' },
              { value: '1002', label: '已审核' },
              { value: '1003', label: '完结' },
              { value: '1004', label: '未通过' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入申请人姓名"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.userName}
            onChange={handleInputChange('userName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入使用人姓名"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.endUserName}
            onChange={handleInputChange('endUserName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入物品名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.resName}
            onChange={handleInputChange('resName')}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择采购方式"
            value={searchParams.warehousingWay}
            onChange={handleInputChange('warehousingWay')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '10000', label: '直接' },
              { value: '20000', label: '流程审批' },
              { value: '30000', label: '紧急' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择采购方式"
            value={searchParams.warehousingWay}
            onChange={handleInputChange('warehousingWay')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: '10000', label: '入库' },
              { value: '20000', label: '出库' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请选择创建开始时间"
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
            label="请选择创建结束时间"
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
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
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
            select
            size="small"
            label="请选择物品规格"
            value={searchParams.rssId}
            onChange={handleSelectChange('rssId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {storeSpecificationList.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.specName}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择供应商"
            value={searchParams.rsId}
            onChange={handleSelectChange('rsId')}
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
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
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
      </Stack>
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
          onClick={handleReset}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
