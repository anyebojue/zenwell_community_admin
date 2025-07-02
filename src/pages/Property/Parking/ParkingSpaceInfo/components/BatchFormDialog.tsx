import React, { Dispatch, SetStateAction, useCallback, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { batchCreate, find } from 'modules/property/parking/parkingSpaceInfo'
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
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ParkingSpaceInfoSlice)
  const { list } = useSelector((state: RootState) => state.ParkingAreaSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    preNum: '',
    startNum: '',
    endNum: '',
    paId: '',
    parkingType: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action = batchCreate(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('批量创建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, formData, page, setOpenDialog]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>批量添加</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>编号前缀：</FormLabel>
            <TextField
              placeholder="选填，不是纯数字时前面字母 如A12 时填写A"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.preNum}
              onChange={e => setFormData({ ...formData, preNum: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始编号：</FormLabel>
            <TextField
              placeholder="必填，请填写编码中数字部分开始编号"
              sx={{ width: '80%' }}
              type="number"
              size="small"
              value={formData.startNum}
              onChange={e => setFormData({ ...formData, startNum: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束编号：</FormLabel>
            <TextField
              placeholder="必填，请填写编码中数字部分结束编号"
              sx={{ width: '80%' }}
              type="number"
              size="small"
              value={formData.endNum}
              onChange={e => setFormData({ ...formData, endNum: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>停车场：</FormLabel>
            <TextField
              placeholder="请选择停车场"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paId || ''}
              onChange={e => setFormData({ ...formData, paId: e.target.value })}
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
            <FormLabel>车位类型：</FormLabel>
            <TextField
              placeholder="请选择车位类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.parkingType || ''}
              onChange={e => setFormData({ ...formData, parkingType: e.target.value })}
              variant="outlined"
            >
              {[
                { label: '普通车位', value: '1' },
                { label: '子母车位', value: '2' },
                { label: '豪华车位', value: '3' },
                { label: '虚拟车位', value: '4' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
