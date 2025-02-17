import { Dispatch, memo, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'
import AssociatedFormSearch from './AssociatedFormSearch'
import AssociatedTableData from './AssociatedTableData'

interface AssociatedProps {
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
  setOwnerInvoice: Dispatch<SetStateAction<OwnerInvoiceApplyReply | undefined>>
}

const Associated: React.FC<AssociatedProps> = ({
  associatedOpen,
  setAssociatedOpen,
  setOwnerInvoice
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())

  return (
    <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <AssociatedFormSearch />
      </DialogTitle>
      <DialogContent>
        <AssociatedTableData
          setOwnerInvoice={setOwnerInvoice}
          selectedRows={selectedRows}
          setAssociatedOpen={setAssociatedOpen}
          setSelectedRows={setSelectedRows}
        />
      </DialogContent>
    </Dialog>
  )
}

export default memo(Associated)
