import { memo, useState } from 'react'
import { Box, Button, Theme } from '@mui/material'
import { Add } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'
import { RolesGroupReply, RolesReply } from 'api/model/platform/rolesModel'
import { CommunityReply } from 'api/model/platform/communityModel'
import AccreditTableData from './AccreditTableData'
import AccreditModel from './AccreditModel'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface AccreditProps {
  dialogValue: RolesReply
}

const Accredit: React.FC<AccreditProps> = ({ dialogValue }) => {
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [dialogGroupValue, setDialogGroupValue] = useState<RolesGroupReply>({})
  const [dialogCommunityValue, setDialogCommunityValue] = useState<CommunityReply | undefined>({})

  return (
    <Box sx={contentBoxStyle}>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<Add />}
        sx={buttonStyles('#2660ad', '#1d428a')}
        onClick={() => setAssociatedOpen(true)}
      >
        关联小区
      </Button>
      <AccreditTableData
        dialogValue={dialogValue}
        dialogGroupValue={dialogGroupValue}
        setDialogGroupValue={setDialogGroupValue}
      />

      <AccreditModel
        dialogValue={dialogValue}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
        dialogCommunityValue={dialogCommunityValue}
        setDialogCommunityValue={setDialogCommunityValue}
      />
    </Box>
  )
}

export default memo(Accredit)
