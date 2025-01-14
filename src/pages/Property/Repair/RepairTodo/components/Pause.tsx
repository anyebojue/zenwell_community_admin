import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repairPoolModel'
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
  DialogTitle
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { find } from 'modules/property/repairStaff'
import { find as findPool } from 'modules/property/repairPool'
import { update } from 'modules/property/repairPool'

interface PauseProps {
  dialogValue: RepairPoolReply | undefined
  pauseOpen: boolean
  setPauseOpen: Dispatch<SetStateAction<boolean>>
}

const Pause: React.FC<PauseProps> = ({ dialogValue, pauseOpen, setPauseOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairStaffSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ content: '' })

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
          statusCd: 2001,
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
        message.success('暂停成功')
        setPauseOpen(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size, statusCd: 1100 }))
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
      setPauseOpen
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={pauseOpen}
      onClose={() => setPauseOpen(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>暂停保修</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>暂停原因：</FormLabel>
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
        <Button variant="contained" color="error" onClick={() => setPauseOpen(false)}>
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

export default memo(Pause)
