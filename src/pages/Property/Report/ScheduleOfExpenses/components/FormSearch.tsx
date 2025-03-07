import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find as findRoom } from 'modules/property/report/queryReportFeeDetailRoom'
import { find as findOwner } from 'modules/property/report/queryReportFeeDetailOwner'
import { find as findContract } from 'modules/property/report/queryReportFeeDetailContract'
import { find as findCar } from 'modules/property/report/queryReportFeeDetailCar'
import { Box, FormControl, Button, Stack, TextField, MenuItem } from '@mui/material'
import { History, Search } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: '1px solid', borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { border: '2px solid', borderColor: 'primary.main' }
  }
}

const getFirstDays = (date = new Date()) => [
  new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0],
  new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().split('T')[0]
]

const FormSearch = ({ activeTabIndex }: { activeTabIndex: number }) => {
  const dispatch = useDispatch()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const pageRoom = useSelector((state: RootState) => state.QueryReportFeeDetailRoomSlice.page)
  const pageOwner = useSelector((state: RootState) => state.QueryReportFeeDetailOwnerSlice.page)
  const pageContract = useSelector(
    (state: RootState) => state.QueryReportFeeDetailContractSlice.page
  )
  const pageCar = useSelector((state: RootState) => state.QueryReportFeeDetailCarSlice.page)

  const pageSlices = useMemo(
    () => [pageRoom, pageOwner, pageContract, pageCar],
    [pageRoom, pageOwner, pageContract, pageCar]
  )

  const currentCommunity = JSON.parse(localStorage.getItem('current_community') || '{}')

  const [searchParams, setSearchParams] = useState({
    startDate: getFirstDays()[0],
    endDate: getFirstDays()[1],
    objName: '',
    ownerName: '',
    link: '',
    communityId: currentCommunity?.id
  })

  const fetchData = useCallback(
    async (
      action: Function,
      params: Record<string, boolean | string | number>,
      loadingMessage: string
    ) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if (res?.error?.message) throw new Error(res.error.message)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  const handleSearch = useCallback(() => {
    const actions = [findRoom, findOwner, findContract, findCar]
    const action = actions[activeTabIndex]
    const page = pageSlices[activeTabIndex]
    fetchData(
      action,
      { ...searchParams, 'page.num': page?.num || '1', 'page.size': page?.size || '20' },
      '正在搜索，请稍后...'
    )
  }, [activeTabIndex, pageSlices, fetchData, searchParams])

  const handleReset = () => {
    setSearchParams({
      startDate: getFirstDays()[0],
      endDate: getFirstDays()[1],
      objName: '',
      ownerName: '',
      link: '',
      communityId: currentCommunity?.id
    })
    handleSearch()
  }

  useEffect(() => handleSearch(), [activeTabIndex, handleSearch])

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mb: 1.5 }}>
        {['startDate', 'endDate', 'objName', 'ownerName', 'link'].map((field, index) => (
          <FormControl key={index} sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
            <TextField
              size="small"
              label={
                field === 'startDate'
                  ? '请输入开始时间'
                  : field === 'endDate'
                    ? '请输入结束时间'
                    : `请输入${field}`
              }
              type={field.includes('Date') ? 'date' : 'text'}
              variant="outlined"
              sx={textFieldStyles}
              value={searchParams[field as keyof typeof searchParams]}
              onChange={e => setSearchParams({ ...searchParams, [field]: e.target.value })}
              slotProps={field.includes('Date') ? { inputLabel: { shrink: true } } : {}}
            />
          </FormControl>
        ))}
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择小区"
            value={searchParams.communityId}
            onChange={e => setSearchParams({ ...searchParams, communityId: e.target.value })}
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
          onClick={handleReset}
        >
          重置
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
