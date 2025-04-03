import React, { Dispatch, SetStateAction, useCallback, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ParkingSpaceApplyParams,
  ParkingSpaceApplyReply
} from 'api/model/property/parking/parkingSpaceApplyModel'
import { find, update } from 'modules/property/parking/parkingSpaceApply'
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

const statusType: Record<string, string> = {
  '9901': '家用小汽车',
  '9902': '客车',
  '9903': '货车',
  '9904': '电动车',
  '9905': '三轮车',
  '9906': '信用期车辆（1个月）'
}

const formatDateTime = (date: Date | string | undefined): string => {
  const validDate = date ? new Date(date) : new Date()
  const year = validDate.getFullYear()
  const month = String(validDate.getMonth() + 1).padStart(2, '0')
  const day = String(validDate.getDate()).padStart(2, '0')
  const hours = String(validDate.getHours()).padStart(2, '0')
  const minutes = String(validDate.getMinutes()).padStart(2, '0')
  const seconds = String(validDate.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

interface ExamineProps {
  dialogValue?: ParkingSpaceApplyReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const Examine: React.FC<ExamineProps> = ({ dialogValue, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ParkingSpaceApplySlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<ParkingSpaceApplyParams>({
    startTime: formatDateTime(new Date()),
    endTime: formatDateTime(new Date()),
    stateCd: '',
    remark: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = {
          ...formData,
          communityId: community?.id
        }
        const action = update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('审核成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dialogValue?.id, dispatch, page.num, page.size, setOpenDialog]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>审核信息</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>起租时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.startTime)}
              onChange={e =>
                setFormData({ ...formData, startTime: formatDateTime(e.target.value) })
              }
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结租时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.startTime)}
              onChange={e => setFormData({ ...formData, endTime: formatDateTime(e.target.value) })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>审核结果：</FormLabel>
            <TextField
              placeholder="请选择审核结果"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.stateCd || ''}
              onChange={e => setFormData({ ...formData, stateCd: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '2002', label: '通过' },
                { value: '4004', label: '不通过' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>审核意见：</FormLabel>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            申请信息：车牌号：{dialogValue?.carNum}，汽车品牌：{dialogValue?.carBrand}，车辆类型：
            {statusType[dialogValue?.carType || '']}， 颜色：{dialogValue?.carColor}，起租时间：
            {dialogValue?.startTime}，结租时间：{dialogValue?.endTime}， 申请人：
            {dialogValue?.applyPersonName}，申请人电话：备注：{dialogValue?.remark}
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

export default memo(Examine)
