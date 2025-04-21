import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, ButtonGroup, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Download } from '@mui/icons-material'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import BuildingStatistics from './components/BuildingStatistics'
import FeeStatistics from './components/FeeStatistics'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const FeeConfigIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.QueryReportFeeSummarySlice)
  const { list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const modifiedFloorList = [{ id: '', name: '全部' }, ...floorList]
  const [selectedButton, setSelectedButton] = useState<string>('')

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
          {modifiedFloorList.map(item => (
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
        <Box sx={{ width: '90%', height: '100%' }}>
          <FormSearch selectedButton={selectedButton} />
          <Box sx={contentBoxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">费用汇总表(按天更新)</Typography>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => {
                  if (exportUrl) {
                    window.open(exportUrl, '_blank')
                  } else {
                    alert('暂无导出链接')
                  }
                }}
              >
                导出
              </Button>
            </Box>
            <TableData selectedButton={selectedButton} />
          </Box>
          <BuildingStatistics />
          <FeeStatistics />
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(FeeConfigIndex)
