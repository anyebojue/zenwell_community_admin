import { memo } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, Divider, Stack, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReturnPayFeeReply } from 'api/model/property/feeConfig/returnPayFeeModel'
import { Close } from '@mui/icons-material'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RolesIndex = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const row: ReturnPayFeeReply = location.state.value
  const theme = useTheme()

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <Box sx={contentBoxStyle}>
          <Stack
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            direction="row"
            spacing={1}
          >
            <Typography variant="h6">费用信息</Typography>
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
                { label: '费用ID', value: row?.feeId },
                {
                  label: '费用标识',
                  value:
                    row?.payFee?.feeFlag === '1003006'
                      ? '周期性费用'
                      : row?.payFee?.feeFlag === '2006012'
                        ? '一次性费用'
                        : '-'
                },
                { label: '费用类型', value: row.payFee?.feeConfig?.feeConfigType?.name },
                { label: '付费对象', value: row?.payFee?.payerObjName },
                { label: '费用项', value: row?.payFee?.feeConfig?.feeConfigType?.name },
                {
                  label: '费用状态',
                  value:
                    row?.status === 1000
                      ? '退费中'
                      : row.status === 1100
                        ? '已退费'
                        : row.status === 1200
                          ? '退费失败'
                          : row.status === 1300
                            ? '退费单'
                            : row.status === 1400
                              ? '正常'
                              : row.status === 1500
                                ? '欠费'
                                : '-'
                },
                { label: '建账时间', value: row?.createdAt },
                { label: '计费开始时间', value: row?.payFeeDetail?.startTime },
                { label: '计费结束时间', value: row?.payFeeDetail?.endTime },
                { label: '收费截止时间', value: row?.endTime },
                { label: '面积', value: row.payFee?.feeConfig?.scale },
                { label: '单价', value: row?.payFee?.feeConfig?.squarePrice },
                { label: '附加费', value: row?.payFee?.feeConfig?.additionalAmount }
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
          <Typography sx={{ mb: 4 }} variant="h6">
            缴费历史
          </Typography>
          <FormSearch />
          <TableData />
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
