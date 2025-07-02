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
import {
  ParkingSpaceInfoParams,
  ParkingSpaceInfoReply
} from 'api/model/property/parking/parkingSpaceInfoModel'
import { create, find, update } from 'modules/property/parking/parkingSpaceInfo'
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
  dialogValue?: ParkingSpaceInfoReply
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
  const { page } = useSelector((state: RootState) => state.ParkingSpaceInfoSlice)
  const { list } = useSelector((state: RootState) => state.ParkingAreaSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      num: dialogType === 'edit' ? dialogValue?.num || '' : '',
      paId: dialogType === 'edit' ? dialogValue?.paId || '' : '',
      parkingType: dialogType === 'edit' ? dialogValue?.parkingType || '' : '',
      area: dialogType === 'edit' ? dialogValue?.area || 0 : 0,
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ParkingSpaceInfoParams>(initialFormData)

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
            <FormLabel>停车场编号：</FormLabel>
            <TextField
              placeholder="必填，请填写车位编码"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.num}
              onChange={e => setFormData({ ...formData, num: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>停车场：</FormLabel>
            <TextField
              placeholder="请选择停车场"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paId || ''}
              onChange={e => setFormData({ ...formData, paId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>车位类型：</FormLabel>
            <TextField
              placeholder="请选择车位类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.parkingType || ''}
              onChange={e => setFormData({ ...formData, parkingType: e.target.value })}
              variant="outlined"
            >
              {[
                { label: '普通车位', value: '1' },
                { label: '子母车位', value: '2' },
                { label: '豪华车位', value: '3' },
                { label: '虚拟车位', value: '4' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>面积：</FormLabel>
            <TextField
              placeholder="选填，请填写面积"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: Number(e.target.value) })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>备注：</FormLabel>
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
