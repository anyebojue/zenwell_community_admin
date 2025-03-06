import { memo } from 'react'
import { Box, Theme, Typography } from '@mui/material'

const cardBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const Statistics = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={cardBoxStyle}>
        <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
          费用类统计
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              实收金额
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              欠费金额
            </Typography>
            <Typography variant="h6">14811945.56</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              优惠金额
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={cardBoxStyle}>
        <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
          工单类统计
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              投诉单
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              未完成投诉单
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              完成投诉单
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={cardBoxStyle}>
        <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
          出入统计
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              进场车辆数
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              出场车辆数
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '15px 15px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={14}>
              进场人员数
            </Typography>
            <Typography variant="h6">0</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={cardBoxStyle}>
        <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
          其他统计
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '10px 10px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={13}>
              场地预约数
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              0
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '10px 10px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={13}>
              合同数
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              0
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid hsl(210, 98%, 48%)',
              borderRadius: '15px',
              padding: '10px 10px',
              width: '33%'
            }}
          >
            <Typography variant="body1" fontSize={13}>
              合同资产变更
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(Statistics)
