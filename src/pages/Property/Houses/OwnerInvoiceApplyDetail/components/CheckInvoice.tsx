import { memo } from 'react'
import { Box } from '@mui/material'
import { OwnerInvoiceApplyReply } from 'api/model/property/houses/ownerInvoiceApplyModel'

interface PlanIndexProps {
  dialogValue: OwnerInvoiceApplyReply
}

const PlanIndex: React.FC<PlanIndexProps> = ({ dialogValue }) => {
  return dialogValue.invoiceImg ? (
    <img src={dialogValue.invoiceImg} alt="invoiceImg" style={{ width: '100%' }} />
  ) : (
    <Box>没有发票</Box>
  )
}

export default memo(PlanIndex)
