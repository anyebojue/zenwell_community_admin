import { memo, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Divider, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation } from 'react-router-dom'
import BillingDetail from './components/BillingDetail'
import AuditRecord from './components/AuditRecord'
import CheckInvoice from './components/CheckInvoice'

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
          <Typography variant="h6">发票详情</Typography>
          <Divider sx={{ p: 0.5, mb: 2 }} />
          <Box sx={{ pb: 0.2 }}>
            <Grid container spacing={2}>
              {[
                { label: '编号', value: row?.id },
                {
                  label: '发票类型',
                  value:
                    row?.invoiceType === '1001' ? '个人' : row?.invoiceType === '2002' ? '企业' : ''
                },
                { label: '业主名称', value: row?.ownerName },
                { label: '申请人', value: row?.createUserName },
                { label: '发票名头', value: row?.ownerInvoice.invoiceName },
                { label: '纳税人识别号', value: row?.ownerInvoice.invoiceNum },
                { label: '地址', value: row?.ownerInvoice.invoiceAddress },
                { label: '电话', value: row?.invoiceLink },
                { label: '申请金额', value: row?.invoiceAmount },
                {
                  label: '审核状态',
                  value:
                    row?.stateCd === 'W'
                      ? '待审核'
                      : row?.stateCd === 'U'
                        ? '待上传'
                        : row?.stateCd === 'F'
                          ? '审核失败'
                          : row?.stateCd === 'G'
                            ? '待领用'
                            : row?.stateCd === 'C'
                              ? '已领用'
                              : ''
                },
                { label: '申请时间', value: row?.createdAt },
                { label: '发票编号', value: row?.invoiceCode || '未上传' }
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
            <Tab sx={{ pl: 2, pr: 2 }} label="开票明细" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="审核记录" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="查看发票" value={2} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <AuditRecord dialogValue={row} />}
            {activeTabIndex === 1 && <BillingDetail dialogValue={row} />}
            {activeTabIndex === 2 && <CheckInvoice dialogValue={row} />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
