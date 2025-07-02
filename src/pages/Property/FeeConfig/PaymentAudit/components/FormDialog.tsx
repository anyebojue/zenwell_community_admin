import React, { Dispatch, SetStateAction, useCallback, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeAuditParams, PayFeeAuditReply } from 'api/model/property/feeConfig/payFeeAuditModel'
import { find, update, updateBatch } from 'modules/property/feeConfig/payFeeAudit'
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
  DialogTitle,
  MenuItem
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'

interface FormDialogProps {
  selectedRows: Set<string>
  dialogValue?: PayFeeAuditReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  selectedRows,
  dialogValue,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.PayFeeAuditSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<PayFeeAuditParams>({
    stateCd: '',
    message: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const ids = Array.from(selectedRows).join(',')
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action = update({
          id: dialogValue?.id,
          ...params
        })
        const actionBatch = updateBatch({
          ids,
          statusCd: formData.stateCd || '',
          message: formData.message || ''
        })
        const res = await dispatch(selectedRows.size ? actionBatch : action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dialogValue?.id, selectedRows, dispatch, page.num, page.size, setOpenDialog]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>审核信息</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>审核状态：</FormLabel>
            <TextField
              placeholder="请选择审核状态"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.stateCd || ''}
              onChange={e => setFormData({ ...formData, stateCd: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '2020', label: '同意' },
                { value: '3030', label: '拒绝' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>原因：</FormLabel>
            <TextField
              placeholder="必填，请填写原因"
              sx={{ width: '80%' }}
              type="text"
              multiline
              rows={2}
              size="small"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
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
