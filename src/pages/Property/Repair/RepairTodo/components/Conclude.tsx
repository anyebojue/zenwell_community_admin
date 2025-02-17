import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
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
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { find as findPool } from 'modules/property/repair/repairPool'
import { update } from 'modules/property/repair/repairPool'
import { uploadImage } from 'api/info'
import { AddCircle } from '@mui/icons-material'

const MAINTENANCE_OPTIONS = [
  { label: '需要用料', value: '1003' },
  { label: '无需用料', value: '1004' }
]

interface ConcludeProps {
  dialogValue: RepairPoolReply | undefined
  concludeOpen: boolean
  setConcludeOpen: Dispatch<SetStateAction<boolean>>
}

const Conclude: React.FC<ConcludeProps> = ({ dialogValue, concludeOpen, setConcludeOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairStaffSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ maintenanceType: '', content: '' })
  const [images, setImages] = useState({ before: '', after: '' })

  const handleImageChange =
    (type: 'before' | 'after') => (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(111)
      const file = event.target.files?.[0]
      if (file) {
        uploadImage(file)
          .then(imageUrl => {
            setImages(prevImages => ({ ...prevImages, [type]: imageUrl }))
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
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const { id, repairSettingId } = dialogValue || {}
        if (!id || !repairSettingId) throw new Error('Invalid repair data')
        const params = {
          id,
          communityId: community.id,
          repairSettingId,
          statusCd: 1900,
          updateStatusMsg: { ...formData, pic_before: images.before, pic_after: images.after }
        }
        console.log(params)
        const action = update(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('办结成功')
        setConcludeOpen(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size, statusCd: 1100 }))
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, formData, images, dialogValue, page.num, page.size, setConcludeOpen]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={concludeOpen}
      onClose={() => setConcludeOpen(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>报修退单</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>是否用料：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.maintenanceType}
              onChange={e => setFormData({ ...formData, maintenanceType: e.target.value })}
              variant="outlined"
            >
              {MAINTENANCE_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>处理意见：</FormLabel>
            <TextField
              placeholder="请输入"
              sx={{ width: '80%' }}
              size="small"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              variant="outlined"
              multiline
              rows={2}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>维修前图片：</FormLabel>
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
                onChange={handleImageChange('before')}
              />

              {images.before ? (
                <img src={images.before} alt="维修前" style={{ width: '200px' }} />
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
                    点击上传维修前图片
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>维修后图片：</FormLabel>
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
                id="after-image-upload"
                onChange={handleImageChange('after')}
              />

              {images.after ? (
                <img src={images.after} alt="维修后" style={{ width: '200px' }} />
              ) : (
                <>
                  <label
                    htmlFor="after-image-upload"
                    onClick={() => document.getElementById('after-image-upload')?.click()}
                  >
                    <IconButton sx={{ color: '#2660ad' }}>
                      <AddCircle />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="textSecondary">
                    点击上传维修后图片
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setConcludeOpen(false)}>
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

export default memo(Conclude)
