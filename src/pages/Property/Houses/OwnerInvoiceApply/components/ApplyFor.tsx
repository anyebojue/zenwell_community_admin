import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceParams } from 'api/model/property/ownerInvoiceModel'
import { create, find } from 'modules/property/ownerInvoice'
import {
  Box,
  CircularProgress,
  FormLabel,
  MenuItem,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { OwnerReply } from 'api/model/property/ownerModel'
import Associated from './Associated'

interface FormDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerInvoiceSlice)
  const [loading, setLoading] = useState(false)
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [ownerInvoice, setOwnerInvoice] = useState<OwnerReply>()
  const [formData, setFormData] = useState<OwnerInvoiceParams>({
    ownerId: '',
    ownerName: '',
    invoiceType: '',
    invoiceName: '',
    invoiceNum: '',
    invoiceAddress: '',
    invoiceLink: '',
    invoiceAccount: '',
    remark: ''
  })

  useEffect(() => {
    if (ownerInvoice?.id) {
      setFormData(prevData => ({
        ...prevData,
        ownerId: ownerInvoice.id,
        ownerName: ownerInvoice.name
      }))
    }
  }, [ownerInvoice])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData, ownerId: ownerInvoice?.id, ownerName: ownerInvoice?.name }
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('申请成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, ownerInvoice?.id, ownerInvoice?.name, dispatch, page.num, page.size, setOpenDialog]
  )

  const formFields = [
    { label: '业主', type: 'text', id: 'invoiceName', required: true },
    { label: '纳税人识别号', type: 'text', id: 'invoiceNum', required: true },
    { label: '电话', type: 'text', id: 'invoiceLink', required: true },
    { label: '地址', type: 'text', id: 'invoiceAddress', required: true }
  ]

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ component: 'form', onSubmit: handleSubmit }}
      >
        <DialogTitle>发票抬头</DialogTitle>
        <DialogContent dividers sx={{ margin: '0 10px 0' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>发票抬头：</FormLabel>
              <TextField
                placeholder="请输入"
                sx={{ width: '53%' }}
                size="small"
                value={formData.ownerName}
                onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                variant="outlined"
              />
              <Button
                size="small"
                variant="contained"
                color="error"
                sx={{ width: '15%', ...buttonStyles('#2660ad', '#1d428a') }}
                onClick={() => setAssociatedOpen(true)}
              >
                选择
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>发票类型：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                select
                size="small"
                value={formData.invoiceType}
                onChange={e => setFormData({ ...formData, invoiceType: e.target.value })}
                variant="outlined"
              >
                {[
                  { value: '1001', label: '个人' },
                  { value: '2002', label: '企业' }
                ].map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {formFields.map(({ label, type, id, required }) => (
              <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                key={id}
              >
                <FormLabel>{label}：</FormLabel>
                <TextField
                  placeholder="请输入"
                  type={type}
                  sx={{ width: '80%' }}
                  size="small"
                  required={required}
                  id={id}
                  value={formData[id as keyof OwnerInvoiceParams]}
                  onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                  autoComplete={type === 'password' ? 'current-password' : ''}
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setOpenDialog(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
      <Associated
        setOwnerInvoice={setOwnerInvoice}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </>
  )
}

export default memo(FormDialog)
