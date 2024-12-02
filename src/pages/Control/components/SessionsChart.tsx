import { useTheme, Card, CardContent, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'

const AreaGradient = ({ color, id }: { color: string; id: string }) => {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

export default function SessionsChart() {
  const theme = useTheme()
  const data = ['小区一', '小区二', '小区三', '小区四', '小区五', '小区六', '小区七']

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark
  ]

  return (
    <Card variant="outlined" sx={{ width: '100%', pb: 3 }}>
      <CardContent>
        <Typography component="h4" variant="h4" gutterBottom>
          小区缴费统计
        </Typography>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: data // 7个数据点
            }
          ]}
          series={[
            {
              id: 'direct',
              label: 'Direct',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [300, 900, 600, 1200, 1500, 1800, 2400]
            },
            {
              id: 'referral',
              label: 'Referral',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [500, 900, 700, 1400, 1100, 1700, 2300]
            },
            {
              id: 'organic',
              label: 'Organic',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: [1000, 1500, 1200, 1700, 1300, 2000, 2400],
              area: true
            }
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-organic': {
              fill: "url('#organic')"
            },
            '& .MuiAreaElement-series-referral': {
              fill: "url('#referral')"
            },
            '& .MuiAreaElement-series-direct': {
              fill: "url('#direct')"
            }
          }}
          slotProps={{
            legend: {
              hidden: true
            }
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  )
}
