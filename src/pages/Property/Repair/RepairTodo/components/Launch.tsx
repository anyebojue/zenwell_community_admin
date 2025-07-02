import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { find } from 'modules/property/repair/repairStaff'
import { find as findPool } from 'modules/property/repair/repairPool'
import { update } from 'modules/property/repair/repairPool'

interface LaunchProps {
  dialogValue: RepairPoolReply | undefined
  activateOpen: boolean
  setActivateOpen: Dispatch<SetStateAction<boolean>>
}

const Launch: React.FC<LaunchProps> = ({ dialogValue, activateOpen, setActivateOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairStaffSlice)
  const [loading, setLoading] = useState(false)

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
          updateStatusMsg: {}
        }
        const action = update({ ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('启动成功')
        setActivateOpen(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size, statusCd: 1100 }))
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dialogValue?.id, dialogValue?.repairSettingId, dispatch, page.num, page.size, setActivateOpen]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={activateOpen}
      onClose={() => setActivateOpen(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>启动报修</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Typography variant="h6">确定启动报修么?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setActivateOpen(false)}>
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

export default memo(Launch)
