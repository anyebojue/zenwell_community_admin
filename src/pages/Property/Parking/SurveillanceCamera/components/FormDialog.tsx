import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MachineParams, MachineReply } from 'api/model/property/parking/machineModel'
import { create, find, update } from 'modules/property/parking/machine'
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

interface FormDialogProps {
  dialogValue?: MachineReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.MachineSlice)
  const { list } = useSelector((state: RootState) => state.ParkingBoxSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      machineCode: dialogType === 'edit' ? dialogValue?.machineCode || '' : '',
      machineName: dialogType === 'edit' ? dialogValue?.machineName || '' : '',
      machineIp: dialogType === 'edit' ? dialogValue?.machineIp || '' : '',
      direction: dialogType === 'edit' ? dialogValue?.direction || '' : '',
      manufacturer: dialogType === 'edit' ? dialogValue?.manufacturer || '' : '',
      video: dialogType === 'edit' ? dialogValue?.video || '' : '',
      pbId: dialogType === 'edit' ? dialogValue?.pbId || '' : '',
      heartbeatTime:
        dialogType === 'edit'
          ? dialogValue?.heartbeatTime || formatDateTime(new Date())
          : formatDateTime(new Date())
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<MachineParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, page, setOpenDialog, initialFormData]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>设备名称：</FormLabel>
            <TextField
              placeholder="必填，请填写设备名称"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.machineName}
              onChange={e => setFormData({ ...formData, machineName: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>设备编码：</FormLabel>
            <TextField
              placeholder="必填，请填写设备编码"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.machineCode}
              onChange={e => setFormData({ ...formData, machineCode: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>设备IP：</FormLabel>
            <TextField
              placeholder="必填，请填写设备IP"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.machineIp}
              onChange={e => setFormData({ ...formData, machineIp: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>设备方向：</FormLabel>
            <TextField
              label="请选择设备方向"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.direction || ''}
              onChange={e => setFormData({ ...formData, direction: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '3306', label: '进' },
                { value: '3307', label: '出' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>道闸厂家：</FormLabel>
            <TextField
              placeholder="请填写道闸厂家"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.manufacturer}
              onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>岗亭：</FormLabel>
            <TextField
              label="请选择岗亭"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.pbId || ''}
              onChange={e => setFormData({ ...formData, pbId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.boxName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>监控视频：</FormLabel>
            <TextField
              placeholder="请填写监控视频"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.video}
              onChange={e => setFormData({ ...formData, video: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>设备心跳时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.heartbeatTime)}
              onChange={e =>
                setFormData({ ...formData, heartbeatTime: formatDateTime(e.target.value) })
              }
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

export default memo(FormDialog)
