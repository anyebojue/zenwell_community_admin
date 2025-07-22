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
  ParkingSpaceApplyParams,
  ParkingSpaceApplyReply
} from 'api/model/property/parking/parkingSpaceApplyModel'
import { create, find, update } from 'modules/property/parking/parkingSpaceApply'
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
  dialogValue?: ParkingSpaceApplyReply
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
  const { page } = useSelector((state: RootState) => state.ParkingSpaceApplySlice)
  const { list } = useSelector((state: RootState) => state.OwnerSlice)
  const { list: parkingSpaceList } = useSelector((state: RootState) => state.ParkingSpaceInfoSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      carNum: dialogType === 'edit' ? dialogValue?.carNum || '' : '',
      psId: dialogType === 'edit' ? dialogValue?.psId || '' : '',
      carBrand: dialogType === 'edit' ? dialogValue?.carBrand || '' : '',
      carType: dialogType === 'edit' ? dialogValue?.carType || '' : '',
      carColor: dialogType === 'edit' ? dialogValue?.carColor || '' : '',
      startTime:
        dialogType === 'edit'
          ? dialogValue?.startTime || formatDateTime(new Date())
          : formatDateTime(new Date()),
      endTime:
        dialogType === 'edit'
          ? dialogValue?.endTime || formatDateTime(new Date())
          : formatDateTime(new Date()),
      applyPersonId: dialogType === 'edit' ? dialogValue?.applyPersonId || '' : '',
      applyPersonLink: dialogType === 'edit' ? dialogValue?.applyPersonLink || '' : '',
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ParkingSpaceApplyParams>(initialFormData)

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
        const params = {
          ...formData,
          communityId: community?.id,
          applyPersonName: list.filter(item => item.id === formData.applyPersonId)[0]?.name,
          stateCd: '1001'
        }
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
    [
      formData,
      list,
      dialogType,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      setOpenDialog,
      initialFormData
    ]
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
            <FormLabel>车牌号：</FormLabel>
            <TextField
              placeholder="必填，请填写车牌号"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.carNum}
              onChange={e => setFormData({ ...formData, carNum: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>停车位：</FormLabel>
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
            <FormLabel>汽车品牌：</FormLabel>
            <TextField
              placeholder="必填，请填写汽车品牌"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.carBrand}
              onChange={e => setFormData({ ...formData, carBrand: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>车辆类型：</FormLabel>
            <TextField
              placeholder="请选择车辆类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.carType || ''}
              onChange={e => setFormData({ ...formData, carType: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '9901', label: '家用小汽车' },
                { value: '9902', label: '客车' },
                { value: '9903', label: '货车' },
                { value: '9904', label: '电动车' },
                { value: '9905', label: '三轮车' },
                { value: '9906', label: '信用期车辆（1个月）' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>颜色：</FormLabel>
            <TextField
              placeholder="必填，请填写颜色"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.carColor}
              onChange={e => setFormData({ ...formData, carColor: e.target.value })}
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
            <FormLabel>申请人：</FormLabel>
            <TextField
              disabled={dialogType === 'edit'}
              placeholder="请选择申请人"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.applyPersonId || ''}
              onChange={e => setFormData({ ...formData, applyPersonId: e.target.value })}
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
            <FormLabel>申请人电话：</FormLabel>
            <TextField
              disabled={dialogType === 'edit'}
              placeholder="必填，请填写申请人电话"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.applyPersonLink}
              onChange={e => setFormData({ ...formData, applyPersonLink: e.target.value })}
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
