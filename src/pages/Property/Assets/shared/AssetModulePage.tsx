import { memo, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  alpha
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { zhCN } from '@mui/x-data-grid/locales'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { request } from 'utils/request/axios'
import { AssetPageConfig } from './config'

interface ListResponse {
  list: Array<Record<string, any>>
  page?: {
    total: string
  }
}

const cardStyle = (index: number) => ({
  p: 2.25,
  minHeight: 132,
  borderRadius: 3,
  color: '#0f172a',
  background:
    index % 2 === 0
      ? 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(224,242,254,0.92))'
      : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(236,253,245,0.92))',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
})

const AssetModulePage = ({ config }: { config: AssetPageConfig }) => {
  const [rows, setRows] = useState<Array<Record<string, any>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const res = await request.get<ListResponse>({
          url: config.endpoint,
          params: {
            'page.num': 1,
            'page.size': 4
          }
        })
        if (!active) {
          return
        }
        setRows(res.data.list || [])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [config.endpoint])

  const stats = useMemo(() => {
    const totalAmount = rows.reduce((sum, item) => sum + Number(item.totalAmount || item.amount || 0), 0)
    const onlineCount = rows.filter(item => ['0', '1200', '通过'].includes(String(item.state || item.statusCd || item.auditStatus))).length

    return [
      {
        label: '模块来源',
        value: '后补模块',
        helper: '用于补齐资产管理能力'
      },
      {
        label: '当前路由',
        value: config.routePath,
        helper: '已挂入左侧菜单'
      },
      {
        label: '展示数据',
        value: `${rows.length} 条`,
        helper: '统一 mock 数据'
      },
      {
        label: '汇总金额',
        value: `${totalAmount}`,
        helper: `有效状态 ${onlineCount} 条`
      }
    ]
  }, [config.routePath, rows])

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'code', headerName: '编号', flex: 1, minWidth: 120 },
      { field: 'name', headerName: '资产名称', flex: 1.2, minWidth: 150 },
      { field: 'ownerName', headerName: '责任人', flex: 1, minWidth: 120 },
      { field: 'statusCd', headerName: '状态', flex: 0.8, minWidth: 100 },
      { field: 'totalAmount', headerName: '金额', flex: 0.8, minWidth: 100 },
      { field: 'createdAt', headerName: '生成时间', flex: 1.2, minWidth: 170 }
    ],
    []
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', minHeight: '100%' }}>
      <NavbarBreadcrumbs />
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(15,23,42,0.08)',
          background:
            'radial-gradient(circle at top left, rgba(14,165,233,0.18), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #eef6ff 100%)'
        }}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
                <Chip
                  label="后补模块"
                  size="small"
                  sx={{
                    bgcolor: '#0f766e',
                    color: '#fff',
                    fontWeight: 700
                  }}
                />
                <Chip
                  label="Mock 数据"
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: alpha('#0f172a', 0.18) }}
                />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                {config.title}
              </Typography>
              <Typography sx={{ mt: 1, maxWidth: 920, color: 'text.secondary', lineHeight: 1.8 }}>
                {config.description}
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                minWidth: { xs: '100%', md: 280 },
                borderRadius: 3,
                bgcolor: alpha('#ffffff', 0.82),
                border: '1px solid rgba(15,23,42,0.08)'
              }}
            >
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>路由位置</Typography>
              <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{config.routePath}</Typography>
              <Typography sx={{ mt: 1.5, fontSize: 13, color: 'text.secondary' }}>能力标签</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, rowGap: 1 }}>
                {config.highlights.map(item => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Stack>
            </Paper>
          </Stack>

          <Alert severity="info" sx={{ borderRadius: 3 }}>
            当前页面为后补资产功能页，已接入统一 mock 请求层，方便你直接演示“新增资产模块”效果。
          </Alert>
        </Stack>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {stats.map((item, index) => (
          <Grid key={item.label} size={{ xs: 12, md: 3 }}>
            <Paper elevation={0} sx={cardStyle(index)}>
              <Typography sx={{ fontSize: 12, letterSpacing: '0.08em', color: 'text.secondary' }}>
                {item.label}
              </Typography>
              <Typography sx={{ mt: 1.2, fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>
                {item.value}
              </Typography>
              <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 13 }}>
                {item.helper}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,
          p: 2,
          borderRadius: 4,
          border: '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 14px 34px rgba(15,23,42,0.06)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              资产业务样例数据
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
              这里展示的是当前模块的 4 条 mock 数据，便于直接验收后补功能的页面效果。
            </Typography>
          </Box>
          <Chip label="来源：统一请求 Mock" variant="outlined" />
        </Stack>

        {loading ? (
          <LinearProgress />
        ) : (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableColumnResize
            disableRowSelectionOnClick
            hideFooter
            localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha('#0ea5e9', 0.08)
              }
            }}
          />
        )}
      </Paper>
      <Copyright />
    </Box>
  )
}

export default memo(AssetModulePage)
