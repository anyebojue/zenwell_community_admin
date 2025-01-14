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
import { createRepairReturnVisit, find as findPool } from 'modules/property/repairPool'

interface ReturnVisitFlagProps {
  dialogValue: RepairPoolReply | undefined
  returnVisitFlag: boolean
  setReturnVisitFlag: Dispatch<SetStateAction<boolean>>
}

const ReturnVisitFlag: React.FC<ReturnVisitFlagProps> = ({
  dialogValue,
  returnVisitFlag,
  setReturnVisitFlag
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RepairPoolSlice)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ visitType: 0, content: '' })

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
          ...formData
        }
        const action = createRepairReturnVisit({ ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        message.success('提交成功')
        setReturnVisitFlag(false)
        await dispatch(findPool({ 'page.num': page.num, 'page.size': page.size, repairType: '1' }))
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
      setReturnVisitFlag
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={returnVisitFlag}
      onClose={() => setReturnVisitFlag(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>回访</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>满意度：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.visitType}
              onChange={e => setFormData({ ...formData, visitType: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { label: '不满意', value: '0' },
                { label: '满意', value: '1' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>回访内容：</FormLabel>
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
        <Button variant="contained" color="error" onClick={() => setReturnVisitFlag(false)}>
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

export default memo(ReturnVisitFlag)
