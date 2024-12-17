import { Dispatch, memo, SetStateAction } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { OrganizationInfoReply } from 'api/model/platform/organizationInfoModel'
import FormSearch from './FormSearch'

interface AssociatedProps {
  dialogValue: OrganizationInfoReply
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const Associated: React.FC<AssociatedProps> = ({
  dialogValue,
  associatedOpen,
  setAssociatedOpen
}) => {
  return (
    <Dialog fullWidth open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <FormSearch dialogValue={dialogValue} />
      </DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={() => setAssociatedOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(Associated)
