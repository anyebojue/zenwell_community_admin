import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
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
  DialogTitle
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { find } from 'modules/property/repair/repairStaff'
import { find as findPool } from 'modules/property/repair/repairPool'
import { update } from 'modules/property/repair/repairPool'

interface SendOrdersProps {
  dialogValue: RepairPoolReply | undefined
  sendOpen: boolean
  setSendOpen: Dispatch<SetStateAction<boolean>>
}

const SendOrders: React.FC<SendOrdersProps> = ({ dialogValue, sendOpen, setSendOpen }) => {
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
        const action = update({ ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('派单成功')
        setSendOpen(false)
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
      setSendOpen
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={sendOpen}
      onClose={() => setSendOpen(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>报修派单</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报修师傅：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.staff_id}
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
        <Button variant="contained" color="error" onClick={() => setSendOpen(false)}>
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

export default memo(SendOrders)
