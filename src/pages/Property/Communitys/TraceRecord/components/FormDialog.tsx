import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomRenovationRecordParams } from 'api/model/property/communitys/roomRenovationRecordModel'
import { create, find } from 'modules/property/communitys/roomRenovationRecord'
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
  MenuItem,
  IconButton,
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { RoomRenovationReply } from 'api/model/property/communitys/roomRenovationModel'
import { uploadImage } from 'api/info'
import { AddCircle } from '@mui/icons-material'

interface FormDialogProps {
  value: RoomRenovationReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ value, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RoomRenovationRecordSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<RoomRenovationRecordParams>({
    roomName: value.roomName,
    status: '待审核',
    isViolation: 0,
    remark: '',
    img: '',
    video: ''
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
        .then(imageUrl => {
          setFormData({ ...formData, img: imageUrl })
        })
        .catch(() => {
          message.error('图片上传失败')
        })
    }
  }

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const action = create({ ...formData, status: String(value.status) })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('新建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, formData, page.num, page.size, setOpenDialog, value.status]
  )

  const formFields = [
    { label: '房屋', type: 'text', id: 'roomName', required: true },
    { label: '状态', type: 'text', id: 'status', required: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>装修跟踪</DialogTitle>
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
                value={formData[id as keyof RoomRenovationRecordParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>是否违规：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.isViolation}
              onChange={e => setFormData({ ...formData, isViolation: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '否' },
                { value: 1, label: '是' }
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>发票：</FormLabel>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #2660ad',
                borderRadius: '8px',
                width: '80%',
                padding: '10px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input
                type="file"
                style={{ display: 'none' }}
                id="before-image-upload"
                onChange={handleImageChange}
              />
              {formData.img ? (
                <img src={formData.img} alt="发票" style={{ width: '200px' }} />
              ) : (
                <>
                  <label
                    htmlFor="before-image-upload"
                    onClick={() => document.getElementById('before-image-upload')?.click()}
                  >
                    <IconButton sx={{ color: '#2660ad' }}>
                      <AddCircle />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="textSecondary">
                    点击上传发票图片
                  </Typography>
                </>
              )}
            </Box>
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
