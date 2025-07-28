import React, { Dispatch, memo, SetStateAction, useState } from 'react'
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  FormLabel,
  TextField
} from '@mui/material'
import message from 'components/Message'
import { ImportCustomFee } from 'api/property/feeConfig/payFee'
import { buttonStyles } from 'components/DeleteModal'

interface ImportCustomFeeProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const ImportCustom: React.FC<ImportCustomFeeProps> = ({ openDialog, setOpenDialog }) => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      message.warning('请选择文件进行上传')
      return
    }
    const current_community = localStorage.getItem('current_community')
    const community = JSON.parse(current_community || '')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('communityId', community?.id)
    setLoading(true)
    try {
      await ImportCustomFee(formData)
      message.success('文件上传成功')
      setFile(null)
      setOpenDialog(false)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>自定义创建费用</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>选择文件</FormLabel>
            <TextField
              type="file"
              sx={{ width: '80%' }}
              size="small"
              required
              onChange={handleFileChange}
              slotProps={{
                htmlInput: {
                  accept: '.xlsx,.xls' // 限制只能选择Excel文件
                }
              }}
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
          {loading ? '导入中...' : '导入'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(ImportCustom)
