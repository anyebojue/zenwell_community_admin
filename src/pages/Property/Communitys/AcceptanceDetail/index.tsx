import { memo } from 'react'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { useLocation, useNavigate } from 'react-router-dom'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RoomRenovationRecordsIndex = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const row = location.state.value
  console.log(row)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {row.room.unit.floor.name}-{row.room.unit.unitNum}-{row.room.roomNum} 验收明细
            </Typography>
            <Stack spacing={1} direction="row">
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => navigate(-1)}
              >
                返回
              </Button>
            </Stack>
          </Box>
          <TableData />
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(RoomRenovationRecordsIndex)
