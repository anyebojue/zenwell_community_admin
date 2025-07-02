import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarParams, OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { find, update } from 'modules/property/parking/ownerCar'
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

interface DiscountProps {
  selectedButton: string
  dialogValue?: OwnerCarReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const Discount: React.FC<DiscountProps> = ({
  selectedButton,
  dialogValue,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerCarSlice)
  const { list: parkingSpaceList } = useSelector((state: RootState) => state.ParkingSpaceInfoSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<OwnerCarParams>({
    carNum: dialogValue?.carNum,
    psId: '',
    startTime: formatDateTime(new Date()),
    endTime: formatDateTime(new Date()),
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
          ...dialogValue,
          ...formData,
          carNum: dialogValue?.carNum,
          communityId: community?.id,
          stateCd: '3003'
        }
        const action = update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { leaseType: selectedButton }),
            isExport: true
          })
        )
        message.success('续租成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dialogValue, formData, dispatch, page.num, page.size, selectedButton, setOpenDialog]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>续租</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>车位：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.psId}
              onChange={e => setFormData({ ...formData, psId: e.target.value })}
              variant="outlined"
            >
              {parkingSpaceList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.num}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>车牌号：</FormLabel>
            <TextField
              disabled
              required
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.carNum || dialogValue?.carNum}
              onChange={e => setFormData({ ...formData, carNum: e.target.value })}
              variant="outlined"
            />
          </Box>
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
            <FormLabel>备注：</FormLabel>
            <TextField
              placeholder="选填，请填写说明"
              sx={{ width: '80%' }}
              type="text"
              multiline
              rows={2}
              size="small"
              value={formData.remark}
              onChange={e => setFormData({ ...formData, remark: e.target.value })}
              variant="outlined"
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

export default memo(Discount)
