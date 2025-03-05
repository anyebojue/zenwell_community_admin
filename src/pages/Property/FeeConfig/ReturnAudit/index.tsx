import { memo, useState } from 'react'
import { ReturnPayFeeReply } from 'api/model/property/feeConfig/returnPayFeeModel'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import { Download } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReturnPayFeeIndex = () => {
  const { exportUrl } = useSelector((state: RootState) => state.ReturnPayFeeSlice)
  const [dialogValue, setDialogValue] = useState<ReturnPayFeeReply | undefined>()
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">退费申请单</Typography>
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
        <TableData setDialogValue={setDialogValue} setOpenDialog={setOpenDialog} />
      </Box>
      <Copyright />
      <FormDialog dialogValue={dialogValue} openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(ReturnPayFeeIndex)
