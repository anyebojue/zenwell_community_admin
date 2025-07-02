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
  const { exportUrl, sumTotal } = useSelector((state: RootState) => state.QueryPayFeeDetailSlice)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">缴费明细表(所有房屋缴费记录明细)</Typography>
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
          <Typography variant="body1">
            小计 应收：{sumTotal.totalReceivableAmount} 元 实收：{sumTotal.totalReceivedAmount} 元
            优惠：
            {sumTotal.totalPreferentialAmount} 元 减免：{sumTotal.totalDeductionAmount} 元 赠送：
            {sumTotal.totalGiftAmount} 元 滞纳金：{sumTotal.totalLateFee} 元
          </Typography>
          <Typography variant="body1">
            大计 应收：{sumTotal.allReceivableAmount} 元 实收：{sumTotal.allReceivedAmount} 元
            优惠：
            {sumTotal.allPreferentialAmount} 元 减免：{sumTotal.allDeductionAmount} 元 赠送：
            {sumTotal.allGiftAmount} 元 滞纳金：{sumTotal.allLateFee} 元
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            优惠金额：打折规则和打折无欠费规则下产生的优惠金额
          </Typography>
          <Typography variant="body1">减免金额：减免规则下产生的减免金额</Typography>
          <Typography variant="body1">赠送金额：赠送规则下赠送月份应缴的金额</Typography>
          <Typography variant="body1">
            滞纳金：违约滞纳金规则下产生的违约金额，需额外缴纳的滞纳金
          </Typography>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
