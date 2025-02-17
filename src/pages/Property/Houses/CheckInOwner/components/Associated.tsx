import { Dispatch, memo, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { HousingManagementReply } from 'api/model/property/houses/housingManagementModel'
import { RoomReply } from 'api/model/property/houses/roomModel'
import FormSearch from './FormSearch'
import AssociatedTableData from './AssociatedTableData'

interface AssociatedProps {
  activeStep: number
  selectfloorValue: HousingManagementReply | undefined
  setSelectRoomValue: Dispatch<SetStateAction<RoomReply | undefined>>
  setSelectFloorValue: Dispatch<SetStateAction<HousingManagementReply | undefined>>
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const Associated: React.FC<AssociatedProps> = ({
  activeStep,
  selectfloorValue,
  setSelectRoomValue,
  setSelectFloorValue,
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
          activeStep={activeStep}
          selectfloorValue={selectfloorValue}
          setSelectRoomValue={setSelectRoomValue}
          setSelectFloorValue={setSelectFloorValue}
          selectedRows={selectedRows}
          setAssociatedOpen={setAssociatedOpen}
          setSelectedRows={setSelectedRows}
        />
      </DialogContent>
    </Dialog>
  )
}

export default memo(Associated)
