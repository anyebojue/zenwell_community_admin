import React, { Dispatch, SetStateAction, useCallback, useEffect, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountRecordParams } from 'api/model/property/feeConfig/applyRoomDiscountRecordModel'
import { create, find } from 'modules/property/feeConfig/applyRoomDiscountRecord'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
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
import { ApplyRoomDiscountReply } from 'api/model/property/feeConfig/applyRoomDiscountModel'
import { AddCircle } from '@mui/icons-material'
import { uploadImage } from 'api/info'

interface FormDialogProps {
  value: ApplyRoomDiscountReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ value, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ApplyRoomDiscountRecordSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<ApplyRoomDiscountRecordParams>({
    roomId: value.roomId,
    stateCd: value.stateCd,
    isTrue: '',
    remark: '',
    img: ''
  })

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

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

  useEffect(() => {
    if (openDialog) {
      fetchData(
        findFeeConfig,
        { 'page.disable': true, feeTypeCd: formData.remark || '' },
        '正在加载列表中，请稍后...'
      )
      fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [fetchData, formData.remark, openDialog])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id, ardId: value.id }
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({ 'page.num': page.num || '1', 'page.size': page.size, ardId: value.id })
        )
        message.success('新建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, value.id, dispatch, page.num, page.size, setOpenDialog]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>新增</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋：</FormLabel>
            <TextField
              disabled
              sx={{ width: '80%' }}
              size="small"
              value={formData.roomId}
              onChange={e => setFormData({ ...formData, roomId: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>状态：</FormLabel>
            <TextField
              disabled
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.stateCd}
              onChange={e => setFormData({ ...formData, stateCd: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1', label: '申请验房' },
                { value: '2', label: '验房通过' },
                { value: '3', label: '验房不通过' },
                { value: '4', label: '审批通过' },
                { value: '5', label: '审批不通过' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>是否违规：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.isTrue}
              onChange={e => setFormData({ ...formData, isTrue: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1', label: '是' },
                { value: '0', label: '否' }
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
              sx={{ width: '80%' }}
              size="small"
              value={formData.remark}
              onChange={e => setFormData({ ...formData, remark: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>上传图片 ：</FormLabel>
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
                    点击上传图片
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
