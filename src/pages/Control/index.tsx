import { memo } from 'react'
import { styled, Paper, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import PageViewsBarChart from './components/PageViewsBarChart'
import SessionsChart from './components/SessionsChart'

const data = [
  {
    title: '小区数',
    value: '57'
  },
  {
    title: '物业数',
    value: '55'
  },
  {
    title: '房屋数',
    value: '474'
  },
  {
    title: '业主数',
    value: '491'
  },
  {
    title: '车辆数',
    value: '84'
  },
  {
    title: '今日缴费数',
    value: '1'
  },
  {
    title: '今日报修数',
    value: '0'
  },
  {
    title: '今日巡检数',
    value: '0'
  },
  {
    title: '今日投诉数',
    value: '0'
  }
]

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}))

const Control = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { sm: '100%', md: '1700px' },
        height: 'calc(100vh - 32px)',
        pt: 8
      }}
    >
      <NavbarBreadcrumbs />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, md: 10 }}
        sx={{ mt: 3, mb: theme => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={2}>
            <Item>
              <Item sx={{ fontSize: '30px', pt: 3 }}>{card.value}</Item>
              <Item sx={{ fontSize: '18px', pb: 3 }}>{card.title}</Item>
            </Item>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} columns={12} sx={{ mt: 3, mb: theme => theme.spacing(2) }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 5, mb: 1.5 }} />
    </Box>
  )
}

export default memo(Control)
