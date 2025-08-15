import { Dispatch, memo, SetStateAction } from 'react'
import { Box, Typography, Theme, TextField, FormLabel, Stack, Divider } from '@mui/material'

interface ProcurementItem {
  storeId: string
  rstId: string
  resName: string
  shId: string
  rssId: string
  rsId: string
  resCode: string
  isFixed: string
  averagePrice: number
  originalStock: string
  unitCode: string
  stock: string
  quantity: string
  remark: string
  price: number
  purchaseQuantity: string
  purchaseRemark: string
  communityId: string
}

interface FormData {
  userId: string
  userName: string
  tel: string
  communityId: string
  storeId: string
  storeName: string
  employess: string
  remark: string
  resOrderType: string
  procurementResourceStores: ProcurementItem[]
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid',
      borderColor: 'primary.main'
    }
  }
}

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface AssociatedProps {
  activeStep: number
  formData: FormData
  setFormData: Dispatch<SetStateAction<FormData>>
}

const Associated: React.FC<AssociatedProps> = ({ activeStep, formData, setFormData }) => {
  return (
    <Box sx={contentBoxStyle}>
      <Box
        sx={{
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6">{activeStep === 1 ? '申请信息' : '审批人信息'}</Typography>
      </Box>
      <Divider />
      {activeStep === 1 ? (
        <Stack spacing={3} sx={{ margin: '20px 10px 10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>联系人：</FormLabel>
            <TextField
              sx={textFieldStyles}
              placeholder="必填，请输入"
              type="text"
              size="small"
              required
              value={formData.userName}
              onChange={e => setFormData({ ...formData, userName: e.target.value })}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>联系电话：</FormLabel>
            <TextField
              sx={textFieldStyles}
              placeholder="必填，请输入"
              type="text"
              size="small"
              required
              value={formData.tel}
              onChange={e => setFormData({ ...formData, tel: e.target.value })}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>申请说明：</FormLabel>
            <TextField
              sx={textFieldStyles}
              placeholder="必填，请输入"
              type="text"
              size="small"
              required
              value={formData.remark}
              onChange={e => setFormData({ ...formData, remark: e.target.value })}
              fullWidth
            />
          </Box>
        </Stack>
      ) : (
        <Stack spacing={3} sx={{ margin: '20px 10px 10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>所属组织：</FormLabel>
            <TextField
              sx={textFieldStyles}
              disabled
              placeholder="必填，请输入"
              type="text"
              size="small"
              required
              value={formData.storeName}
              onChange={e => setFormData({ ...formData, storeName: e.target.value })}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>员工：</FormLabel>
            <TextField
              sx={textFieldStyles}
              disabled
              placeholder="必填，请输入"
              type="text"
              size="small"
              required
              value={formData.employess}
              onChange={e => setFormData({ ...formData, employess: e.target.value })}
              fullWidth
            />
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default memo(Associated)
