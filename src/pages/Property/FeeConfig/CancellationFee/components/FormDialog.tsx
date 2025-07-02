import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeBatchParams, PayFeeBatchReply } from 'api/model/property/feeConfig/payFeeBatchModel'
import { find, update } from 'modules/property/feeConfig/payFeeBatch'
import {
  Box,
  CircularProgress,
  FormLabel,
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

interface FormDialogProps {
  dialogValue?: PayFeeBatchReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ dialogValue, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.PayFeeBatchSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      id: dialogValue?.id,
      createUserName: dialogValue?.createUserName || '',
      createdAt: dialogValue?.createdAt || '',
      msg: ''
    }),
    [dialogValue]
  )
  const [formData, setFormData] = useState<PayFeeBatchParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action = update({ id: dialogValue?.id, stateCd: '2007001', ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('取消成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogValue, formData, page, setOpenDialog, initialFormData]
  )

  const formFields = [
    { label: '批次号', type: 'text', id: 'id', required: true },
    { label: '员工', type: 'text', id: 'createUserName', required: true },
    { label: '创建时间', type: 'text', id: 'createdAt', required: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>费用取消申请</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                disabled
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof PayFeeBatchParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>取消原因：</FormLabel>
            <TextField
              placeholder="选填，请填写说明"
              sx={{ width: '80%' }}
              type="text"
              multiline
              rows={2}
              size="small"
              value={formData.msg}
              onChange={e => setFormData({ ...formData, msg: e.target.value })}
              variant="outlined"
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
  )
}

export default memo(FormDialog)
