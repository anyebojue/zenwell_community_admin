import { memo } from 'react'
import { useTheme, Card, CardContent, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

const PageViewsBarChart = () => {
  const theme = useTheme()
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light
  ]
  return (
    <Card variant="outlined" sx={{ width: '100%', pb: 3 }}>
      <CardContent>
        <Typography component="h4" variant="h4" gutterBottom>
          小区报修统计
        </Typography>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: ['小区一', '小区二', '小区三', '小区四', '小区五', '小区六', '小区七']
              }
            ] as any
          }
          series={[
            {
              id: 'page-views',
              label: 'Page views',
              data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
              stack: 'A'
            },
            {
              id: 'downloads',
              label: 'Downloads',
              data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
              stack: 'A'
            },
            {
              id: 'conversions',
              label: 'Conversions',
              data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
              stack: 'A'
            }
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default memo(PageViewsBarChart)
