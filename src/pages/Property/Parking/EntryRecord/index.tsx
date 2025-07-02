import { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const CarInoutIndex = () => {
  const { list: paList } = useSelector((state: RootState) => state.ParkingAreaSlice)
  const [selectedButton, setSelectedButton] = useState<string>('')

  useEffect(() => {
    if (paList.length) {
      setSelectedButton(paList[0].id || '')
    }
  }, [paList])

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
          <TableData selectedButton={selectedButton} />
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(CarInoutIndex)
