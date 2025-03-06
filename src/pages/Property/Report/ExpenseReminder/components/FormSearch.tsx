import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryPrePaymentParams } from 'api/model/property/report/queryPrePaymentModel'
import { find as findPrePayment } from 'modules/property/report/queryPrePayment'
import { find as findDeadlineFee } from 'modules/property/report/queryDeadlineFee'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
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

interface SearchFormProps {
  activeTabIndex: number
}

const FormSearch: React.FC<SearchFormProps> = ({ activeTabIndex }) => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const { page } = useSelector((state: RootState) => state.QueryPrePaymentSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  const [searchParams, setSearchParams] = useState<QueryPrePaymentParams>({
    objName: '',
    ownerName: '',
    link: '',
    configId: '',
    communityId: ''
  })

  const handleInputChange =
    (field: keyof QueryPrePaymentParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
        return res
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData(findFeeConfig, { 'page.disable': true }, '正在加载费用配置，请稍后...')
  }, [fetchData, page.num, page.size, searchParams])

  const handleSearch = () => {
    fetchData(
      findPrePayment,
      { ...searchParams, 'page.num': page.num, 'page.size': page.size },
      '正在搜索，请稍后...'
    )
  }

  const handleSelectChange =
    (field: keyof QueryPrePaymentParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prevData => ({
        ...prevData,
        [field]: event.target.value
      }))
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '30ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入房屋编号/合同名称/车牌号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.objName}
            onChange={handleInputChange('objName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入业主名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.objName}
            onChange={handleInputChange('objName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入业主手机号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.objName}
            onChange={handleInputChange('objName')}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择收费项"
            value={searchParams.configId}
            onChange={handleInputChange('configId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {feeConfigList.map(option => (
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
            label="请选择小区"
            value={searchParams.communityId || community?.id}
            onChange={handleSelectChange('communityId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {info.community.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
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
          onClick={() => {
            setSearchParams({
              objName: '',
              ownerName: '',
              link: '',
              configId: '',
              communityId: ''
            })
            fetchData(
              activeTabIndex === 0 ? findPrePayment : findDeadlineFee,
              {
                objName: '',
                ownerName: '',
                link: '',
                configId: '',
                communityId: '',
                'page.num': page.num,
                'page.size': page.size
              },
              '正在重置，请稍后...'
            )
          }}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
