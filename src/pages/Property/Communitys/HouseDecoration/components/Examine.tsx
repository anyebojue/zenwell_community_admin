import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  RoomRenovationParams,
  RoomRenovationReply
} from 'api/model/property/communitys/roomRenovationModel'
import { find, update } from 'modules/property/communitys/roomRenovation'
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
  dialogValue: RoomRenovationReply | undefined
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ dialogValue, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RoomRenovationSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<RoomRenovationParams>({
    roomName: dialogValue?.roomName,
    status: '',
    remark: ''
  })

  useEffect(() => {
    setFormData({ roomName: dialogValue?.roomName })
  }, [dialogValue?.roomName])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData }
        const action = update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('编辑成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dialogValue?.id, dispatch, page.num, page.size, setOpenDialog]
  )

  const formFields = [{ label: '房屋', type: 'text', id: 'roomName', required: true }]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>装修审核</DialogTitle>
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
                placeholder="请输入"
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof RoomRenovationParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋状态：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '4000', label: '审核通过' },
                { value: '2000', label: '审核不通过' }
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
