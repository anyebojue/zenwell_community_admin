import { memo, useState } from 'react'
import { Box, Button, Tab, Tabs, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { useSelector } from 'react-redux'
import FormSearch from './components/FormSearch'
import PaymentReminder from './components/PaymentReminder'
import ExpireReminder from './components/ExpireReminder'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReleasesIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.ReportFeeYearCollectionSlice)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">费用提醒</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Download />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => {
                if (exportUrl) {
                  window.open(exportUrl, '_blank')
                } else {
                  alert('暂无导出链接')
                }
              }}
            >
              导出
            </Button>
          </Box>
          <Tabs
            sx={{
              mt: 1,
              border: 'none',
              boxShadow: 'none',
              '& .MuiTab-root': {
                border: 'none',
                boxShadow: 'none'
              },
              '& .MuiTab-root:hover': {
                border: 'none',
                boxShadow: 'none'
              }
            }}
            value={activeTabIndex}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab sx={{ pl: 2, pr: 2 }} label="预缴费提醒" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="到期提醒" value={1} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <PaymentReminder />}
            {activeTabIndex === 1 && <ExpireReminder />}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, ml: 1 }}>
            <Typography variant="body1">温馨提示：此表反馈7天内开始缴费的费用</Typography>
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
