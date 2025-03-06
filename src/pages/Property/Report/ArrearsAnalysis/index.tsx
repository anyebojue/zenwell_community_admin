import { memo, useState } from 'react'
import { Box, Tab, Tabs, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import FormSearch from './components/FormSearch'
import UncollectedStatusSheet from './components/UncollectedStatusSheet'
import DetailsHaveNotBeenReceived from './components/DetailsHaveNotBeenReceived'
import MonthlyFeeSchedule from './components/MonthlyFeeSchedule'

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
            <Tab sx={{ pl: 2, pr: 2 }} label="未收情况表" value={0} />
            <Tab sx={{ pl: 2, pr: 2 }} label="未收明细表" value={1} />
            <Tab sx={{ pl: 2, pr: 2 }} label="当月收费情况表" value={2} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTabIndex === 0 && <UncollectedStatusSheet />}
            {activeTabIndex === 1 && <DetailsHaveNotBeenReceived />}
            {activeTabIndex === 2 && <MonthlyFeeSchedule />}
          </Box>
        </Box>
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
