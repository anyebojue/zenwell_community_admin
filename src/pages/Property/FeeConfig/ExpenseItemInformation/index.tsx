import { memo, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, Divider, Stack, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation, useNavigate } from 'react-router-dom'
import { Close } from '@mui/icons-material'
import ModificationRecord from './components/ModificationRecord'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RolesIndex = () => {
  const location = useLocation()
  const navigate = useNavigate()
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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">费用项信息</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
          </Stack>
          <Divider sx={{ p: 0.5, mb: 2 }} />
          <Box sx={{ pb: 0.2 }}>
            <Grid container spacing={2}>
              {[
                { label: '费用类型', value: row.feeConfigType?.name },
                { label: '费用项', value: row?.name },
                {
                  label: '费用标识',
                  value: row?.feeFlag === '1003006' ? '周期性费用' : '一次性费用'
                },
                { label: '缴费周期', value: row?.paymentCycle },
                {
                  label: '催缴类型',
                  value:
                    row?.billType === '001'
                      ? '每年1月1日'
                      : row?.billType === '002'
                        ? '每月1日'
                        : row?.billType === '003'
                          ? '每日'
                          : ''
                },
                { label: '开始时间', value: row?.startTime },
                { label: '结束时间', value: row?.endTime },
                { label: '账户抵扣', value: row?.deductFrom === 'Y' ? '是' : '否' },
                { label: '手机缴费', value: row?.payOnline === 'Y' ? '是' : '否' },
                {
                  label: '进位方式',
                  value:
                    row?.scale === '1' ? '四舍五入' : row?.scale === '3' ? '向上进位' : '向下进位'
                },
                {
                  label: '保留小数',
                  value:
                    row?.decimalPlace === 0
                      ? '取整'
                      : row?.decimalPlace === 1
                        ? '1位'
                        : row?.decimalPlace === 2
                          ? '2位'
                          : row?.decimalPlace === 3
                            ? '3位'
                            : row?.decimalPlace === 4
                              ? '4位'
                              : ''
                },
                {
                  label: '计算公式',
                  value:
                    row?.computingFormula === '1001'
                      ? '建筑面积*单价+附加费'
                      : row?.computingFormula === '2002'
                        ? '固定费用'
                        : row?.computingFormula === '4004'
                          ? '动态费用'
                          : row?.computingFormula === '5005'
                            ? '本期度数-上期度数*单价+附加费'
                            : row?.computingFormula === '6006'
                              ? '用量*单价+附加费'
                              : row?.computingFormula === '7007'
                                ? '自定义公式'
                                : row?.computingFormula === '9009'
                                  ? '本期度数-上期度数*动态单价+附加费'
                                  : row?.computingFormula === '1101'
                                    ? '租金'
                                    : row?.computingFormula === '3003'
                                      ? '室内面积*单价+附加费'
                                      : row?.computingFormula === '1102'
                                        ? '租金(递增)'
                                        : ''
                },
                { label: '计费单价', value: row?.squarePrice },
                { label: '附加费', value: row?.additionalAmount }
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
            <Tab sx={{ pl: 2, pr: 2 }} label="修改记录" value={0} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <ModificationRecord dialogValue={row} />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
