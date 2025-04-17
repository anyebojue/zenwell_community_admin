import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpacePersonParams } from 'api/model/property/houses/spacePersonModel'
import { create } from 'modules/property/houses/spacePerson'
import { find } from 'modules/property/houses/space'
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
import { SpaceReply } from 'api/model/property/houses/spaceModel'

interface FormDialogProps {
  dialogValue: SpaceReply
  spaceId: string
  spaceTime: string
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  spaceId,
  spaceTime,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.SpacePersonSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SpacePersonParams>({ appointmentTime: spaceTime })

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      appointmentTime: spaceTime
    }))
  }, [spaceTime])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const res = await dispatch(create({ spaceId: spaceId, ...formData }))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({ 'page.num': page.num || '1', 'page.size': page.size, venueId: dialogValue.id })
        )
        message.success('新建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, spaceId, formData, page.num, page.size, dialogValue.id, setOpenDialog]
  )

  const formFields = [
    { label: '预约人', type: 'text', id: 'personName', required: true },
    { label: '预约电话', type: 'text', id: 'personTel', required: true },
    { label: '应收金额', type: 'text', id: 'receivableAmount', required: true },
    { label: '实收金额', type: 'text', id: 'receivedAmount', required: true },
    { label: '预约时间', type: 'text', id: 'appointmentTime', required: true, disabled: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>场地预约</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required, disabled }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                disabled={disabled}
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof SpacePersonParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>支付方式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.payWay}
              onChange={e => setFormData({ ...formData, payWay: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 1, label: '现金' },
                { value: 2, label: '微信' },
                { value: 3, label: '支付宝' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
  )
}

export default memo(FormDialog)
