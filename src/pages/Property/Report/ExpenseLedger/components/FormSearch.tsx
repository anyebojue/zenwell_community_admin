import { ChangeEvent, memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReportFeeYearCollectionParams } from 'api/model/property/report/reportFeeYearCollectionModel'
import { find } from 'modules/property/report/reportFeeYearCollection'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
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
  const { page } = useSelector((state: RootState) => state.ReportFeeYearCollectionSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [searchParams, setSearchParams] = useState<ReportFeeYearCollectionParams>({
    feeId: '',
    configId: '',
    objName: ''
  })

  const handleInputChange =
    (field: keyof ReportFeeYearCollectionParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
    fetchData(
      findFeeConfigType,
      { 'page.num': page.num, 'page.size': page.size },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size])

  useEffect(() => {
    if (searchParams.feeId) {
      fetchData(
        findFeeConfig,
        { 'page.num': page.num, 'page.size': page.size, feeTypeCd: searchParams.feeId },
        '正在加载费用配置，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, searchParams.feeId])

  const handleSearch = () => {
    fetchData(
      find,
      {
        ...searchParams,
        objType: activeTabIndex === 0 ? '3333' : '6666',
        'page.num': page.num,
        'page.size': page.size
      },
      '正在搜索，请稍后...'
    )
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择费用类型"
            value={searchParams.feeId}
            onChange={handleInputChange('feeId')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {feeConfigTypeList.map(option => (
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
            size="small"
            label="请输入房屋编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.objName}
            onChange={handleInputChange('objName')}
          />
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
              feeId: '',
              configId: '',
              objName: ''
            })
            fetchData(
              find,
              {
                objType: activeTabIndex === 0 ? '3333' : '6666',
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
