import { memo } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { useSelector } from 'react-redux'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReleasesIndex = () => {
  const { exportUrl, allOweAmount, totalPreferentialAmount } = useSelector(
    (state: RootState) => state.QueryOweFeeDetailSlice
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">欠费明细表(房屋与费用项关联的欠费明细按天更新)</Typography>
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
        <TableData />
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, ml: 1 }}>
          <Typography variant="body1">小计 {totalPreferentialAmount} 元</Typography>
          <Typography variant="body1">大计 {allOweAmount} 元</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            费用开始时间：所创建费用的计费起始时间
          </Typography>
          <Typography variant="body1">
            欠费时长（天）：押金费用项欠费时长是费用开始时间到当天的天数
          </Typography>
          <Typography variant="body1">
            除押金外的费用项欠费时长是费用的开始时间到费用的结束时间的天数
          </Typography>
          <Typography variant="body1">欠费金额：欠费周期内应缴费用</Typography>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
