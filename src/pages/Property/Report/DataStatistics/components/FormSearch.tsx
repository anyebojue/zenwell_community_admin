import { memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QueryFeeDataReportParams } from 'api/model/property/report/queryFeeDataReportModel'
import { find as findFeeDataReport } from 'modules/property/report/queryFeeDataReport'
import { find as findOrderDataReport } from 'modules/property/report/queryOrderDataReport'
import { find as findInoutDataReport } from 'modules/property/report/queryInoutDataReport'
import { find as findOthersDataReport } from 'modules/property/report/queryOthersDataReport'
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import message from 'components/Message'

interface SearchFormProps {
  activeTabIndex: number
}

const FormSearch: React.FC<SearchFormProps> = ({ activeTabIndex }) => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  const getToday = () => new Date().toISOString().split('T')[0]

  const [searchParams, setSearchParams] = useState<QueryFeeDataReportParams>({
    startDate: getToday(),
    endDate: getToday(),
    communityId: community?.id
  })

  const [selectedRange, setSelectedRange] = useState<number>(0)

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

  useEffect(() => {
    fetchData(
      findFeeDataReport,
      { 'page.disable': true, ...searchParams },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findOrderDataReport,
      { 'page.disable': true, ...searchParams },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findInoutDataReport,
      { 'page.disable': true, ...searchParams },
      '正在加载列表中，请稍后...'
    )
    fetchData(
      findOthersDataReport,
      { 'page.disable': true, ...searchParams },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, searchParams])

  const handleQuickSelect = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    setSearchParams(prev => ({
      ...prev,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }))
    setSelectedRange(days)
  }

  useEffect(() => {
    if (activeTabIndex === 0) {
      console.log('实收统计')
    } else if (activeTabIndex === 1) {
      console.log('实收明细')
    } else if (activeTabIndex === 2) {
      console.log('收款方式统计')
    } else if (activeTabIndex === 3) {
      console.log('欠费统计')
    } else if (activeTabIndex === 4) {
      console.log('欠费明细')
    } else if (activeTabIndex === 5) {
      console.log('收缴情况')
    } else if (activeTabIndex === 6) {
      console.log('月实收明细')
    } else if (activeTabIndex === 7) {
      console.log('月欠费明细')
    } else {
      console.log('')
    }
  }, [activeTabIndex])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
      <Stack alignItems="center" direction="row" spacing={1} component="form">
        <Typography variant="body2">统计时间：</Typography>
        <TextField
          size="small"
          type="date"
          value={searchParams.startDate}
          onChange={e => setSearchParams({ ...searchParams, startDate: e.target.value })}
        />
        <Typography variant="body2">至：</Typography>
        <TextField
          size="small"
          type="date"
          value={searchParams.endDate}
          onChange={e => setSearchParams({ ...searchParams, endDate: e.target.value })}
        />
        <TextField
          select
          size="small"
          value={searchParams.communityId || community?.id}
          onChange={e => setSearchParams({ ...searchParams, communityId: e.target.value })}
        >
          {info.community.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={0.1} component="form">
        <Button
          variant="text"
          color={selectedRange === 0 ? 'secondary' : 'inherit'}
          onClick={() => handleQuickSelect(0)}
        >
          今日
        </Button>
        <Button
          variant="text"
          color={selectedRange === 1 ? 'secondary' : 'inherit'}
          onClick={() => handleQuickSelect(1)}
        >
          昨日
        </Button>
        <Button
          variant="text"
          color={selectedRange === 7 ? 'secondary' : 'inherit'}
          onClick={() => handleQuickSelect(7)}
        >
          近7日
        </Button>
        <Button
          variant="text"
          color={selectedRange === 30 ? 'secondary' : 'inherit'}
          onClick={() => handleQuickSelect(30)}
        >
          近30日
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
