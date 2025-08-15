import { memo, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Divider, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation } from 'react-router-dom'
import AMapExample from 'components/AMapExample'
import PointIndex from './components/PointIndex'
import DetailIndex from './components/DetailIndex'
import RouteIndex from './components/RouteIndex'
import PlanIndex from './components/PlanIndex'

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
                { label: '任务编码', value: row.id },
                { label: '巡检计划', value: row.inspectionPlanId },
                { label: '开始/结束时间', value: `${row.planInsTime} - ${row.planEndTime}` },
                { label: '实际巡检时间', value: row.actInsTime },
                { label: '计划巡检人', value: row.planUserName },
                { label: '当前巡检人', value: row.actUserName },
                { label: '转移描述', value: row.transferDesc },
                { label: '巡检方式', value: row.signType },
                {
                  label: '巡检状态',
                  value:
                    row.stateCd === 0
                      ? '未开始'
                      : row.stateCd === 1
                        ? '进行中'
                        : row.stateCd === 2
                          ? '已完成'
                          : ''
                }
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
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检明细" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检地图" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检计划" value={2} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检路线" value={3} />
            <Tab sx={{ pl: 2, pr: 2 }} label="巡检点" value={4} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <DetailIndex dialogValue={row} />}
            {activeTabIndex === 1 && <AMapExample mapHeight="500px" />}
            {activeTabIndex === 2 && <PlanIndex dialogValue={row} />}
            {activeTabIndex === 3 && <RouteIndex dialogValue={row} />}
            {activeTabIndex === 4 && <PointIndex dialogValue={row} />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
