import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  OwnerInvoiceApplyParams,
  OwnerInvoiceApplyReply
} from 'api/model/property/houses/ownerInvoiceApplyModel'
import { find, update } from 'modules/property/houses/ownerInvoiceApply'
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
  IconButton,
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { AddCircle } from '@mui/icons-material'
import { uploadImage } from 'api/info'

interface FormDialogProps {
  dialogValue: OwnerInvoiceApplyReply | undefined
  selectedButton: string
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  selectedButton,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerInvoiceSlice)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState('')

  const [formData, setFormData] = useState<OwnerInvoiceApplyParams>({
    invoiceCode: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const action = update({
          id: dialogValue?.id,
          ...formData,
          invoiceImg: images,
          communityId: community.id,
          stateCd: 'G'
        })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({
            'page.num': page.num || '1',
            'page.size': page.size,
            ...(selectedButton && { stateCd: selectedButton })
          })
        )
        message.success('审核成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      dialogValue?.id,
      formData,
      images,
      dispatch,
      page.num,
      page.size,
      selectedButton,
      setOpenDialog
    ]
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
        .then(imageUrl => {
          setImages(imageUrl as string)
        })
        .catch(() => {
          message.error('图片上传失败')
        })
    }
  }

  const formFields = [{ label: '发票编号', type: 'text', id: 'invoiceCode', required: true }]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>上传发票</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
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
                value={formData[id as keyof OwnerInvoiceApplyParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
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
              {images ? (
                <img src={images} alt="发票" style={{ width: '200px' }} />
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
