import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Copyright from 'layouts/components/Copyright'
import CustomizedDataGrid from './components/CustomizedDataGrid'

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <CustomizedDataGrid />
      <Copyright sx={{ my: 4 }} />
    </Box>
  )
}
