import React, { Dispatch, SetStateAction, useCallback, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChargeMonthOrderParams } from 'api/model/property/parking/chargeMonthOrderModel'
import { create, find } from 'modules/property/parking/chargeMonthOrder'
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
  const { page } = useSelector((state: RootState) => state.ChargeMonthOrderSlice)
  const { list } = useSelector((state: RootState) => state.ChargeMonthCardSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<ChargeMonthOrderParams>({
    cardId: '',
    primeRate: '',
    receivableAmount: '',
    receivedAmount: '',
    remark: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('购买成功')
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
      <DialogTitle>购买月卡</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>月卡：</FormLabel>
            <TextField
              placeholder="请选择停车场"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.cardId || ''}
              onChange={e => setFormData({ ...formData, cardId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.cardName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>支付方式：</FormLabel>
            <TextField
              placeholder="请选择车位类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.primeRate || ''}
              onChange={e => setFormData({ ...formData, primeRate: e.target.value })}
              variant="outlined"
            >
              {[
                { label: '现金', value: '1' },
                { label: 'POS刷卡', value: '2' },
                { label: '微信二维码', value: '3' },
                { label: '支付宝二维码', value: '4' },
                { label: '转账', value: '7' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>应收金额：</FormLabel>
            <TextField
              placeholder="必填，请填写应收金额"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.receivableAmount}
              onChange={e => setFormData({ ...formData, receivableAmount: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>实收金额：</FormLabel>
            <TextField
              placeholder="选填，请填写实收金额"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.receivedAmount}
              onChange={e => setFormData({ ...formData, receivedAmount: e.target.value })}
              variant="outlined"
            />
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
