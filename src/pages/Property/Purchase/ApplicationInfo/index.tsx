import { memo, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, Divider, Stack, Tab, Tabs, Theme, Typography, useTheme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { useLocation, useNavigate } from 'react-router-dom'
import { Close, Print } from '@mui/icons-material'
import { BusinessPurchaseApplyReply } from 'api/model/property/purchase/businessPurchaseApplyModel'
import ApplyForMaterials from './components/ApplyForMaterials'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const statusCd: Record<string, string> = {
  '1000': '未审核',
  '1001': '审核中',
  '1002': '已审核',
  '1003': '完结',
  '1004': '未通过'
}

const statusValue: Record<string, string> = {
  '10000': '采购入库',
  '20000': '紧急采购'
}

const RolesIndex = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const row: BusinessPurchaseApplyReply = location.state.value
  const theme = useTheme()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const current_community = localStorage.getItem('current_community')
  const community = JSON.parse(current_community || '')

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <Box sx={contentBoxStyle}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">申请信息</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Print />}
                onClick={() => navigate(-1)}
              >
                打印
              </Button>
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
          </Stack>
          <Divider sx={{ p: 0.5, mb: 2 }} />
          <Box sx={{ pb: 0.2 }}>
            <Grid container spacing={2}>
              {[
                { label: '申请单号', value: row.id },
                { label: '申请人', value: row?.userName },
                { label: '使用人', value: row?.endUserName },
                { label: '联系电话', value: community?.tel },
                { label: '申请时间', value: row?.createdAt },
                { label: '审批状态', value: statusCd[row?.stateCd] },
                { label: '入库方式', value: statusValue[row?.resOrderType] },
                { label: '说明', value: row?.description },
                {
                  label: '参考采购总价格',
                  value: `¥${row.procurementResourceStores.reduce((sum, item) => {
                    return sum + Number(item.price) * Number(item.stock)
                  }, 0)}`
                },
                {
                  label: '实际采购总价格',
                  value: `¥${row.procurementResourceStores.reduce((sum, item) => {
                    return sum + Number(item.averagePrice) * Number(item.stock)
                  }, 0)}`
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
            <Tab sx={{ pl: 2, pr: 2 }} label="申请物资" value={0} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <ApplyForMaterials dialogValue={row} />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RolesIndex)
