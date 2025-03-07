import { memo, useState } from 'react'
import { Box, Tab, Tabs, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import HouseDetailTable from './components/HouseDetailTable'
import OwnerDetailTable from './components/OwnerDetailTable'
import ContractDetailTable from './components/ContractDetailTable'
import VehicleDetailTable from './components/VehicleDetailTable'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReleasesIndex = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle} position="relative">
          <Tabs
            sx={{
              mt: 1,
              border: 'none',
              boxShadow: 'none',
              '& .MuiTab-root': {
                border: 'none',
                boxShadow: 'none'
              },
              '& .MuiTab-root:hover': {
                border: 'none',
                boxShadow: 'none'
              }
            }}
            value={activeTabIndex}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab sx={{ pl: 2, pr: 2 }} label="房屋费用明细" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="业主费用明细" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="合同费用明细" value={2} />
            <Tab sx={{ pl: 2, pr: 2 }} label="车辆费用明细" value={3} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <HouseDetailTable />}
            {activeTabIndex === 1 && <OwnerDetailTable />}
            {activeTabIndex === 2 && <ContractDetailTable />}
            {activeTabIndex === 3 && <VehicleDetailTable />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
