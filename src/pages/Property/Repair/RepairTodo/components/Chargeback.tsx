import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
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
import { find } from 'modules/property/repairStaff'
import { find as findPool } from 'modules/property/repairPool'
import { update } from 'modules/property/repairPool'

interface ChargebackProps {
  dialogValue: RepairPoolReply | undefined
  chargebackOpen: boolean
  setChargebackOpen: Dispatch<SetStateAction<boolean>>
}

const Chargeback: React.FC<ChargebackProps> = ({
  dialogValue,
  chargebackOpen,
  setChargebackOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairStaffSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ staff_id: '', content: '' })

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (dialogValue) {
      setFormData({
        staff_id: dialogValue?.repairLog?.[dialogValue?.repairLog.length - 1].staffId!,
        content: ''
      })
    }
  }, [dialogValue])

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
          statusCd: 1100,
          updateStatusMsg: {
            ...formData,
            staff_name: list.filter(item => item.staffId === formData.staff_id)[0]?.staffName
          }
        }
        console.log(params)
        const action = update({ ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('转单成功')
        setChargebackOpen(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size }))
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
      list,
      page.num,
      page.size,
      setChargebackOpen
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={chargebackOpen}
      onClose={() => setChargebackOpen(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>报修转单</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报修师傅：</FormLabel>
            <TextField
              disabled
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.staff_id || ''}
              onChange={e => setFormData({ ...formData, staff_id: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.staffId} value={option.staffId}>
                  {option.staffName}
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
        <Button variant="contained" color="error" onClick={() => setChargebackOpen(false)}>
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

export default memo(Chargeback)
