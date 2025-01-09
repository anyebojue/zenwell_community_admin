import { Dispatch, memo, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import FormSearch from './FormSearch'
import AssociatedTableData from './AssociatedTableData'

interface AssociatedProps {
  setSelectValue: Dispatch<SetStateAction<HousingManagementReply | undefined>>
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const Associated: React.FC<AssociatedProps> = ({
  setSelectValue,
  associatedOpen,
  setAssociatedOpen
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())

  return (
    <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <FormSearch />
      </DialogTitle>
      <DialogContent>
        <AssociatedTableData
          setSelectValue={setSelectValue}
          selectedRows={selectedRows}
          setAssociatedOpen={setAssociatedOpen}
          setSelectedRows={setSelectedRows}
        />
      </DialogContent>
    </Dialog>
  )
}

export default memo(Associated)
