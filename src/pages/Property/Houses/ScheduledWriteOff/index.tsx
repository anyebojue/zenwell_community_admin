import { memo } from 'react'
import { Box, Button, FormControl, Stack, TextField, Theme } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '20%'
})

const InfoIndex = () => {
  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl sx={{ width: { xs: '100%', md: '23.5ch' } }} variant="outlined">
              <TextField size="small" label="请扫码枪扫码核销" type="text" variant="outlined" />
            </FormControl>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<CheckCircle />}
              sx={{
                ...buttonStyles('#2660ad', '#1d428a'),
                fontSize: '0.85rem',
                minWidth: '80px',
                height: '32px'
              }}
              onClick={() => {}}
            >
              核销
            </Button>
          </Stack>
          <Box sx={{ pt: 1 }}>
            {[
              { label: '核销结果', value: '' },
              { label: '核销时间', value: '' },
              { label: '场地', value: '' },
              { label: '预约日期', value: '' },
              { label: '预约小时', value: '' },
              { label: '预约人', value: '' },
              { label: '预约电话', value: '' }
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1
                }}
              >
                <Box sx={{ py: 1 }}>{item.label}：</Box>
                <Box>{item.value}</Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ width: '100%', height: '100%' }}>
          <FormSearch />
          <TableData />
        </Box>
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(InfoIndex)
