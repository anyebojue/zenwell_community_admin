import { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, ButtonGroup, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const TemporaryVehiclePaymentIndex = () => {
  const { list: paList } = useSelector((state: RootState) => state.ParkingAreaSlice)
  const [selectedButton, setSelectedButton] = useState<string>('')

  useEffect(() => {
    if (paList.length) {
      setSelectedButton(paList[0].id || '')
    }
  }, [paList])

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '150px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {paList.map(item => (
            <Button
              key={item.id}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.id ? '#1976d2' : '#fff',
                color: selectedButton === item.id ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.id ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.id || '')}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <FormSearch selectedButton={selectedButton} />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">临时车缴费</Typography>
            </Box>
            <TableData selectedButton={selectedButton} />
          </Box>
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(TemporaryVehiclePaymentIndex)
