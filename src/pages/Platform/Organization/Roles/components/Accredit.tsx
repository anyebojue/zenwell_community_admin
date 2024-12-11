import { memo } from 'react'
import { Box, Button, Theme } from '@mui/material'
import { Add } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import TableData from './AccreditTableData'

const Accredit = () => {
  const contentBoxStyle = (theme: Theme) => ({
    background: theme.palette.background.default,
    borderRadius: '15px',
    padding: '15px 15px',
    width: '100%'
  })

  return (
    <Box sx={contentBoxStyle}>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<Add />}
        sx={buttonStyles('#2660ad', '#1d428a')}
      >
        关联小区
      </Button>
      <TableData />
    </Box>
  )
}

export default memo(Accredit)
