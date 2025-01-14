import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
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
  DialogTitle
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { find as findPool } from 'modules/property/repairPool'
import { update } from 'modules/property/repairPool'

const MAINTENANCE_OPTIONS = [
  { label: '需要用料', value: '1003' },
  { label: '无需用料', value: '1004' }
]

interface MandatoryReceiptProps {
  dialogValue: RepairPoolReply | undefined
  mandatoryReceipt: boolean
  setMandatoryReceipt: Dispatch<SetStateAction<boolean>>
}

const MandatoryReceipt: React.FC<MandatoryReceiptProps> = ({
  dialogValue,
  mandatoryReceipt,
  setMandatoryReceipt
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairPoolSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ maintenanceType: '', content: '' })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = {
          id: dialogValue?.id,
          communityId: community.id,
          repairSettingId: dialogValue?.repairSettingId,
          statusCd: 1200,
          updateStatusMsg: {
            ...formData
          }
        }
        console.log(params)
        const action = update({ ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('退单成功')
        setMandatoryReceipt(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size, needForceHand: 1 }))
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      dialogValue?.id,
      dialogValue?.repairSettingId,
      dispatch,
      formData,
      page.num,
      page.size,
      setMandatoryReceipt
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={mandatoryReceipt}
      onClose={() => setMandatoryReceipt(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>强制回单</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>是否用料：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.maintenanceType || ''}
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setMandatoryReceipt(false)}>
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

export default memo(MandatoryReceipt)
