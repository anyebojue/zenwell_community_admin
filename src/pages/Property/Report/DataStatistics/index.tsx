import { memo, useState } from 'react'
import { Box, Tab, Tabs, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import HouseTableData from './components/HouseTableData'
import VehicleTableData from './components/VehicleTableData'

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
        <Box sx={contentBoxStyle}>
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
            <Tab sx={{ pl: 2, pr: 2 }} label="实收统计" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="实收明细" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="收款方式统计" value={2} />
            <Tab sx={{ pl: 2, pr: 2 }} label="欠费统计" value={3} />
            <Tab sx={{ pl: 2, pr: 2 }} label="欠费明细" value={4} />
            <Tab sx={{ pl: 2, pr: 2 }} label="收缴情况" value={5} />
            <Tab sx={{ pl: 2, pr: 2 }} label="月实收明细" value={6} />
            <Tab sx={{ pl: 2, pr: 2 }} label="月欠费明细" value={7} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <HouseTableData />}
            {activeTabIndex === 1 && <VehicleTableData />}
            {activeTabIndex === 2 && <VehicleTableData />}
            {activeTabIndex === 3 && <VehicleTableData />}
            {activeTabIndex === 4 && <VehicleTableData />}
            {activeTabIndex === 5 && <VehicleTableData />}
            {activeTabIndex === 6 && <VehicleTableData />}
            {activeTabIndex === 7 && <VehicleTableData />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
