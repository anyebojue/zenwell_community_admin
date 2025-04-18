import { Dispatch, memo, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { OwnerReply } from 'api/model/property/houses/ownerModel'
import AssociatedFormSearch from './AssociatedFormSearch'
import AssociatedTableData from './AssociatedTableData'

interface AssociatedProps {
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
  setOwnerUser: Dispatch<SetStateAction<OwnerReply | undefined>>
}

const Associated: React.FC<AssociatedProps> = ({
  associatedOpen,
  setAssociatedOpen,
  setOwnerUser
}) => {
  return (
    <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <AssociatedFormSearch />
      </DialogTitle>
      <DialogContent>
        <AssociatedTableData setOwnerUser={setOwnerUser} setAssociatedOpen={setAssociatedOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default memo(Associated)
