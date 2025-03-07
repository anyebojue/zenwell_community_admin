import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { Box, Theme } from '@mui/material'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%',
  marginTop: '20px'
})

const dataset = [
  { floorName: '楼栋1号楼', feeRoomRate: 10, feeRate: 87.23 },
  { floorName: 'M78号楼', feeRoomRate: 20, feeRate: 40 },
  { floorName: 'M77号楼', feeRoomRate: 30, feeRate: 60 },
  { floorName: 'M8号楼', feeRoomRate: 40, feeRate: 100 },
  { floorName: '2号楼', feeRoomRate: 50, feeRate: 10 }
]

const generateTicks = (maxValue: number) => {
  const step = Math.ceil(maxValue / 10)
  const ticks = []
  for (let i = 0; i <= maxValue; i += step) {
    ticks.push(i)
  }
  return ticks
}

const chartSetting = (maxFeeRate: number, chartWidth: number) => {
  const ticks = generateTicks(Math.ceil(maxFeeRate))
  return {
    yAxis: [
      {
        id: 'feeRoomRate',
        position: 'left' as const,
        min: 0,
        max: 100
      },
      {
        label: '收费率 (%)',
        id: 'feeRate',
        position: 'right' as const,
        min: 0,
        max: Math.ceil(maxFeeRate),
        ticks
      }
    ],
    xAxis: [
      {
        scaleType: 'band' as const,
        dataKey: 'floorName',
        ticks: ['0', '25', '50', '75', '100']
      }
    ],
    width: chartWidth,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-10px, 0)'
      }
    }
  }
}

export default function BuildingFeeChart() {
  const [chartWidth, setChartWidth] = React.useState<number>(0)
  const chartContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (chartContainerRef.current) {
      setChartWidth(chartContainerRef.current.offsetWidth)
    }
  }, [])

  const maxFeeRate = Math.max(...dataset.map(item => item.feeRate))
  const valueFormatter = (value: number | null) => {
    return value !== null ? `${value}%` : '0%'
  }

  return (
    <Box sx={contentBoxStyle} ref={chartContainerRef}>
      {chartWidth > 0 && (
        <BarChart
          dataset={dataset}
          series={[
            {
              dataKey: 'feeRoomRate',
              label: '户收费率',
              valueFormatter,
              yAxisKey: 'feeRoomRate'
            },
            {
              dataKey: 'feeRate',
              label: '收费率',
              valueFormatter,
              yAxisKey: 'feeRate'
            }
          ]}
          {...chartSetting(maxFeeRate, chartWidth)}
        />
      )}
    </Box>
  )
}
