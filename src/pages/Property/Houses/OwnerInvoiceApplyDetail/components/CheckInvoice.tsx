import { memo } from 'react'
import { Box } from '@mui/material'
import { OwnerInvoiceApplyReply } from 'api/model/property/ownerInvoiceApplyModel'

interface PlanIndexProps {
  dialogValue: OwnerInvoiceApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  return dialogValue.invoiceImg ? (
    <img src="" alt="维修后" style={{ width: '200px' }} />
  ) : (
    <Box>没有发票</Box>
  )
}

export default memo(PlanIndex)
