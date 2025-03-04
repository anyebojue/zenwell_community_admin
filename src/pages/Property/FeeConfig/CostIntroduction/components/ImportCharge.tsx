import React, { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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
  Link
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { ImportFeeParams } from 'api/model/property/feeConfig/importFeeModel'
import { ImportFee } from 'api/property/feeConfig/importFee'

interface FormDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ openDialog, setOpenDialog }) => {
  const { list } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      feeTypeCd: '',
      payerObjType: '3333'
    }),
    []
  )
  const [formData, setFormData] = useState<ImportFeeParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

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
    const formValue = new FormData()
    formValue.append('file', file)
    formValue.append('communityId', community?.id)
    formValue.append('userId', info.id)
    formValue.append('feeTypeCd', formData.feeTypeCd || '')
    formValue.append('payerObjType', formData.payerObjType || '')
    setLoading(true)
    try {
      await ImportFee(formValue)
      message.success('文件上传成功')
      setFile(null)
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
      <DialogTitle>费用导入</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeTypeCd}
              onChange={e => setFormData({ ...formData, feeTypeCd: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用对象：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.payerObjType}
              onChange={e => setFormData({ ...formData, payerObjType: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '3333', label: '房屋' },
                { value: '6666', label: '车位车辆' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>下载模板</Box>
            <Box sx={{ ml: 6.5 }}>
              请先下载
              <Link
                href="https://community-admin.zenwell.cn/files/pvdata/2025-03-04/78250b1bda13648bfe52bed880ecd6bc/feeImport_20250225095734.xlsx"
                download
                sx={{ color: 'blue' }}
              >
                导入模板
              </Link>
              准备数据后，上传导入
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
