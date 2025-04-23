import { memo, useState } from 'react'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Add } from '@mui/icons-material'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import ExpenseSharing from './components/ExpenseSharing'
import ImportCharge from './components/ImportCharge'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ImportFeeIndex = () => {
  const [expense, setExpense] = useState(false)
  const [importFee, setImportFee] = useState(false)
  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">费用导入</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setExpense(true)}
            >
              费用公摊
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setImportFee(true)}
            >
              费用导入
            </Button>
          </Stack>
        </Box>
        <TableData expense={expense} />
      </Box>
      <Copyright />
      <ExpenseSharing openDialog={expense} setOpenDialog={setExpense} />
      <ImportCharge openDialog={importFee} setOpenDialog={setImportFee} />
    </Box>
  )
}

export default memo(ImportFeeIndex)
