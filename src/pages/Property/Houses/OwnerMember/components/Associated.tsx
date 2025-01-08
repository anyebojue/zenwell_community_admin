import { Dispatch, memo, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { OwnerReply } from 'api/model/property/ownerModel'
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
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())

  return (
    <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <AssociatedFormSearch />
      </DialogTitle>
      <DialogContent>
        <AssociatedTableData
          setOwnerUser={setOwnerUser}
          selectedRows={selectedRows}
          setAssociatedOpen={setAssociatedOpen}
          setSelectedRows={setSelectedRows}
        />
      </DialogContent>
    </Dialog>
  )
}

export default memo(Associated)
