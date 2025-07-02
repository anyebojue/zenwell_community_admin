import { memo } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { Download } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { useSelector } from 'react-redux'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReleasesIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.QueryRepairSlice)

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">报修汇总表(以员工为维度，展示员工处理工单情况汇总)</Typography>
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
        <TableData />
      </Box>
      <Copyright />
    </Box>
  )
}

export default memo(ReleasesIndex)
