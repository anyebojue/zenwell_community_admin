import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceParams, OwnerInvoiceReply } from 'api/model/property/ownerInvoiceModel'
import { create, find, update } from 'modules/property/ownerInvoice'
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
  dialogValue?: OwnerInvoiceReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerInvoiceSlice)
  const [loading, setLoading] = useState(false)
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [ownerUser, setOwnerUser] = useState<OwnerReply>()

  const initialFormData = useMemo(
    () => ({
      ownerId: dialogType === 'edit' ? dialogValue?.ownerId || '' : '',
      ownerName: dialogType === 'edit' ? dialogValue?.ownerName || '' : '',
      invoiceType: dialogType === 'edit' ? dialogValue?.invoiceType || '' : '',
      invoiceName: dialogType === 'edit' ? dialogValue?.invoiceName || '' : '',
      invoiceNum: dialogType === 'edit' ? dialogValue?.invoiceNum || '' : '',
      invoiceAddress: dialogType === 'edit' ? dialogValue?.invoiceAddress || '' : '',
      invoiceLink: dialogType === 'edit' ? dialogValue?.invoiceLink || '' : '',
      invoiceAccount: dialogType === 'edit' ? dialogValue?.invoiceAccount || '' : '',
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<OwnerInvoiceParams>(initialFormData)

  useEffect(() => {
    if (ownerUser?.id) {
      setFormData(prevData => ({
        ...prevData,
        ownerId: ownerUser.id,
        ownerName: ownerUser.name
      }))
    }
  }, [ownerUser])

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData, ownerId: ownerUser?.id, ownerName: ownerUser?.name }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      formData,
      ownerUser?.id,
      ownerUser?.name,
      dialogType,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      setOpenDialog,
      initialFormData
    ]
  )

  const formFields = [
    { label: '发票名头', type: 'text', id: 'invoiceName', required: true },
    { label: '纳税人识别号', type: 'text', id: 'invoiceNum', required: true },
    { label: '地址', type: 'text', id: 'invoiceAddress', required: true },
    { label: '电话', type: 'text', id: 'invoiceLink', required: true },
    { label: '开户行及账号', type: 'text', id: 'invoiceAccount', required: true }
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
        <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
        <DialogContent dividers sx={{ margin: '0 10px 0' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>业主：</FormLabel>
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
                选择业主
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>备注：</FormLabel>
              <TextField
                placeholder="请输入"
                sx={{ width: '80%' }}
                size="small"
                value={formData.remark}
                onChange={e => setFormData({ ...formData, remark: e.target.value })}
                variant="outlined"
                multiline
                rows={2}
              />
            </Box>
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
        setOwnerUser={setOwnerUser}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </>
  )
}

export default memo(FormDialog)
