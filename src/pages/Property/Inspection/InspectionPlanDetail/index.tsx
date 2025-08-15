import { memo, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Divider, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation } from 'react-router-dom'
import PointIndex from './components/PointIndex'
import TaskIndex from './components/TaskIndex'
import DetailIndex from './components/DetailIndex'
import RouteIndex from './components/RouteIndex'
import StaffIndex from './components/StaffIndex'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RolesIndex = () => {
  const location = useLocation()
  const row = location.state.value
  const theme = useTheme()
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <Box sx={contentBoxStyle}>
          <Typography variant="h6">巡检计划</Typography>
          <Divider sx={{ p: 0.5, mb: 2 }} />
          <Box sx={{ pb: 0.2 }}>
            <Grid container spacing={2}>
              {[
                { label: '计划名称', value: row.inspectionPlanName },
                { label: '计划路线', value: row.spectionRoute.name },
                {
                  label: '计划周期',
                  value:
                    row.inspectionPlanPeriod === 1
                      ? '月/日'
                      : row.inspectionPlanPeriod === 2
                        ? '按周'
                        : ''
                },
                {
                  label: '签到方式',
                  value:
                    row.status === 0 ? '现场定位' : row.status === 1 ? '现场拍照(默认定位)' : ''
                },
                { label: '日期范围', value: `${row.startDate} - ${row.endDate}` },
                { label: '时间范围', value: `${row.startTime} - ${row.endTime}` },
                { label: '任务提前(分钟)', value: row.beforeTime },
                { label: '制定人', value: row.communityId },
                { label: '制定时间', value: row.createdAt },
                { label: '状态', value: row.status === 0 ? '禁用' : row.status === 1 ? '启用' : '' }
              ].map((item, index) => (
                <Grid size={{ xs: 3, sm: 3, md: 3 }} key={index}>
                  <Typography variant="body2">
                    {item.label}：{item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        <Box sx={{ ...contentBoxStyle(theme), marginTop: '10px' }}>
          <Tabs
            sx={{
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
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检人员" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检路线" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检点" value={2} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检任务" value={3} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检明细" value={4} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <StaffIndex dialogValue={row} />}
            {activeTabIndex === 1 && <RouteIndex dialogValue={row} />}
            {activeTabIndex === 2 && <PointIndex dialogValue={row} />}
            {activeTabIndex === 3 && <TaskIndex dialogValue={row} />}
            {activeTabIndex === 4 && <DetailIndex dialogValue={row} />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
