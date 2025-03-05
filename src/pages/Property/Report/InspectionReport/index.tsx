import { memo, useState } from 'react'
import { Box, Button, ButtonGroup, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { ImportExport, Print } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const CommunityAnnouncementIndex = () => {
  const [selectedButton, setSelectedButton] = useState('0')

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '150px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {[
            { value: '0', label: '巡检点统计' },
            { value: '1', label: '今日巡检' }
          ].map(item => (
            <Button
              key={item.value}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.value ? '#1976d2' : '#fff',
                color: selectedButton === item.value ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.value ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.value || '0')}
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <FormSearch />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {selectedButton === '0' ? '巡检点统计' : '今日巡检'}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<ImportExport />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {}}
                >
                  导出
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Print />}
                  sx={buttonStyles('#2660ad', '#1d428a')}
                  onClick={() => {}}
                >
                  打印
                </Button>
              </Stack>
            </Box>
            <TableData selectedButton={selectedButton} />
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(CommunityAnnouncementIndex)
