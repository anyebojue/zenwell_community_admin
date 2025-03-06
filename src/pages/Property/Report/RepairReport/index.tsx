import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, ButtonGroup, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { Download, Print } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { find } from 'modules/property/feeConfig/meterType'
import { find as findDict } from 'modules/property/report/reportDict'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const CommunityAnnouncementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list: dictList } = useSelector((state: RootState) => state.ReportDictSlice)
  const repairItems = useMemo(
    () =>
      dictList
        .filter(item => item.tableDesc === 'repair')
        .slice()
        .reverse(),
    [dictList]
  )
  const [selectedButton, setSelectedButton] = useState('0')

  useEffect(() => {
    if (repairItems.length) {
      setSelectedButton(repairItems[0]?.value || '0')
    }
  }, [repairItems])

  const selectedItem = useMemo(
    () => repairItems.find(item => item.value === selectedButton),
    [repairItems, selectedButton]
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

  useEffect(() => {
    fetchData(findDict, { 'page.disable': true }, '正在加载列表中，请稍后...')
  }, [fetchData])

  useEffect(() => {
    fetchData(
      find,
      { 'page.num': page.num, 'page.size': page.size, componentType: selectedButton },
      '正在加载列表中，请稍后...'
    )
  }, [fetchData, page.num, page.size, selectedButton])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '200px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {repairItems.map(item => (
            <Button
              key={item.value}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.value ? '#1976d2' : '#fff',
                color: selectedButton === item.value ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.value ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.value || '0')}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          {selectedButton !== '6' && <FormSearch selectedButton={selectedButton} />}
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">{selectedItem?.name}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Download />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {}}
                >
                  导出
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Print />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {}}
                >
                  打印
                </Button>
              </Stack>
            </Box>
            <TableData />
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(CommunityAnnouncementIndex)
