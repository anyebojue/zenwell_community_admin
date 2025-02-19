import React, { Dispatch, SetStateAction, useCallback, useState, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeConfigDiscountParams } from 'api/model/property/feeConfig/payFeeConfigDiscountModel'
import { create, find } from 'modules/property/feeConfig/payFeeConfigDiscount'
import { find as findDiscount } from 'modules/property/feeConfig/feeDiscount'
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
  const { page, list } = useSelector((state: RootState) => state.FeeDiscountSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PayFeeConfigDiscountParams>({
    remark: '1001',
    discountId: '',
    startTime: '',
    endTime: '',
    paymaxEndTime: ''
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

  useEffect(() => {
    if (openDialog) {
      fetchData(
        findDiscount,
        {
          'page.num': page.num,
          'page.size': page.size,
          ...(formData.remark && { discountType: formData.remark })
        },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, formData.remark, openDialog, page.num, page.size])

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
        message.success('新建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
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
      <DialogTitle>新增</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>折扣类型：</FormLabel>
            <TextField
              placeholder="请选择折扣类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.remark || ''}
              onChange={e => setFormData({ ...formData, remark: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1001', label: '优惠' },
                { value: '2002', label: '违约' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>折扣名称：</FormLabel>
            <TextField
              placeholder="请选择折扣名称"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.discountId || ''}
              onChange={e => setFormData({ ...formData, discountId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
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
