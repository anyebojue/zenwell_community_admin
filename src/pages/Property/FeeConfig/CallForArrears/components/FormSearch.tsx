import { ChangeEvent, memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeCollectionDetailParams } from 'api/model/property/feeConfig/feeCollectionDetailModel'
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
  const [searchParams, setSearchParams] = useState<FeeCollectionDetailParams>({
    ownerName: '',
    feeName: '',
    StaffName: '',
    collectionWay: '',
    stateCd: '',
    payerObjName: ''
  })

  const fetchData = useCallback(
    async (params: FeeCollectionDetailParams & PaginationParams) => {
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
    (field: keyof FeeCollectionDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(prev => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  const handleSelectChange =
    (field: keyof FeeCollectionDetailParams) => (event: ChangeEvent<HTMLInputElement>) => {
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
            label="请输入业主名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.ownerName}
            onChange={handleInputChange('ownerName')}
          />
        </FormControl>
        <FormControl>
          <TextField
            size="small"
            label="请填写费用名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.feeName}
            onChange={handleInputChange('feeName')}
          />
        </FormControl>
        <FormControl>
          <TextField
            size="small"
            label="请填写催缴人"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.StaffName}
            onChange={handleInputChange('StaffName')}
          />
        </FormControl>
        <FormControl variant="outlined">
          <TextField
            select
            size="small"
            label="请选择催缴方式"
            value={searchParams.collectionWay}
            onChange={handleSelectChange('collectionWay')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 'WECHAT', label: '微信模板消息' },
              { value: 'SMS', label: '短信' },
              { value: 'PRINT', label: '上门催缴' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
        <FormControl variant="outlined">
          <TextField
            select
            size="small"
            label="请选择状态"
            value={searchParams.stateCd}
            onChange={handleSelectChange('stateCd')}
            variant="outlined"
            sx={textFieldStyles}
          >
            {[
              { value: 'W', label: '待催缴' },
              { value: 'C', label: '催缴完成' },
              { value: 'F', label: '催缴失败' },
              { value: 'D', label: '催缴中' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
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
            setSearchParams({
              ownerName: '',
              feeName: '',
              StaffName: '',
              collectionWay: '',
              stateCd: '',
              payerObjName: ''
            })
            fetchData({
              ownerName: '',
              feeName: '',
              StaffName: '',
              collectionWay: '',
              stateCd: '',
              payerObjName: '',
              'page.num': page.num,
              'page.size': page.size
            })
          }}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
