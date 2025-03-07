import { memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryReportFeeSummaryParams } from 'api/model/property/report/queryReportFeeSummaryModel'
import { find } from 'modules/property/report/queryReportFeeSummary'
import { Box, FormControl, Button, Stack, TextField } from '@mui/material'
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

interface FormSearchProps {
  selectedButton: string
}

const FormSearch: React.FC<FormSearchProps> = ({ selectedButton }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [searchParams, setSearchParams] = useState<QueryReportFeeSummaryParams>({
    startDate: '',
    endDate: '',
    objName: '',
    ownerName: '',
    link: ''
  })

  const fetchData = useCallback(
    async (params: QueryReportFeeSummaryParams & PaginationParams) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { feeTypeCd: selectedButton }),
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
    [dispatch, page.num, page.size, selectedButton]
  )

  const handleSearch = () => {
    fetchData(searchParams)
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入开始时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.startDate}
            onChange={e =>
              setSearchParams(prevData => ({ ...prevData, startDate: e.target.value }))
            }
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
            label="请输入结束时间"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.endDate}
            onChange={e => setSearchParams(prevData => ({ ...prevData, endDate: e.target.value }))}
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
            label="请输入房屋编号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.objName}
            onChange={e => setSearchParams(prevData => ({ ...prevData, objName: e.target.value }))}
          />
        </FormControl>
        <FormControl>
          <TextField
            size="small"
            label="请输入业主名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.ownerName}
            onChange={e =>
              setSearchParams(prevData => ({ ...prevData, ownerName: e.target.value }))
            }
          />
        </FormControl>
        <FormControl>
          <TextField
            size="small"
            label="请输入业主手机号"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
            value={searchParams.link}
            onChange={e => setSearchParams(prevData => ({ ...prevData, link: e.target.value }))}
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
              startDate: '',
              endDate: '',
              objName: '',
              ownerName: '',
              link: ''
            })
            fetchData({
              startDate: '',
              endDate: '',
              objName: '',
              ownerName: '',
              link: '',
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
