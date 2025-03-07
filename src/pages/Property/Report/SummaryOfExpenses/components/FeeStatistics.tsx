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
  {
    oweRoomCount: 4,
    curReceivedFee: 326.1495,
    name: '物业费',
    curReceivableFee: 434.0366,
    feeRoomCount: 4,
    feeRoomRate: 0,
    feeRate: 75.14
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 1900,
    name: '押金',
    curReceivableFee: 1900,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 100
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '停车费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '煤气费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '取暖费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '维修费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '服务费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '其他',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 21.4286,
    name: '水费',
    curReceivableFee: 71.4286,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 30
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '电费',
    curReceivableFee: 4.6071,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '公摊费',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '系统费用',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  },
  {
    oweRoomCount: 0,
    curReceivedFee: 0,
    name: '租金',
    curReceivableFee: 0,
    feeRoomCount: 0,
    feeRoomRate: 0,
    feeRate: 0
  }
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
        dataKey: 'name',
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
