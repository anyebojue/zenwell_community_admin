import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RoomReply, RoomParams } from 'api/model/property/roomModel'
import { HousingManagementReply } from 'api/model/property/housingManagementModel'
import { create, find, update } from 'modules/property/room'
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
  dialogValue?: HousingManagementReply
  dialogRoomValue: RoomReply
  openRoomDialog: boolean
  setOpenRoomDialog: Dispatch<SetStateAction<boolean>>
  dialogType: string
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogRoomValue,
  openRoomDialog,
  setOpenRoomDialog,
  dialogType
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: floorList } = useSelector((state: RootState) => state.HousingManagementSlice)
  const [loading, setLoading] = useState(false)
  console.log(dialogRoomValue)

  const initialFormData = useMemo(
    () => ({
      floorId: dialogType === 'edit' ? dialogRoomValue?.unit?.floorId || '' : '',
      unitId: dialogType === 'edit' ? dialogRoomValue?.unitId || '' : '',
      roomNum: dialogType === 'edit' ? dialogRoomValue?.roomNum || '' : '',
      layer: dialogType === 'edit' ? dialogRoomValue?.layer || '' : '',
      roomSubType: dialogType === 'edit' ? dialogRoomValue?.roomSubType || '' : '',
      builtUpArea: dialogType === 'edit' ? dialogRoomValue?.builtUpArea || 0 : 0,
      roomArea: dialogType === 'edit' ? dialogRoomValue?.roomArea || 0 : 0,
      feeCoefficient: dialogType === 'edit' ? dialogRoomValue?.feeCoefficient || 0 : 0,
      state: dialogType === 'edit' ? dialogRoomValue?.state || '' : '',
      remark: dialogType === 'edit' ? dialogRoomValue?.remark || '' : ''
    }),
    [dialogType, dialogRoomValue]
  )
  const [formData, setFormData] = useState<RoomParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogRoomValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.disable': true }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenRoomDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dialogType, dialogRoomValue?.id, dispatch, setOpenRoomDialog, initialFormData]
  )

  const formFields = [
    { label: '房屋编号', type: 'text', id: 'roomNum', required: true },
    { label: '房屋楼层', type: 'text', id: 'layer', required: true },
    { label: '建筑面积(平方)', type: 'text', id: 'builtUpArea', required: true },
    { label: '室内面积(平方)', type: 'text', id: 'roomArea', required: true },
    { label: '算费系数', type: 'text', id: 'feeCoefficient', required: true },
    { label: '备注', type: 'text', id: 'remark', required: false }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openRoomDialog}
      onClose={() => setOpenRoomDialog(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>楼栋：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.floorId}
              onChange={e => setFormData({ ...formData, floorId: e.target.value })}
              variant="outlined"
            >
              {floorList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>单元：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.unitId}
              onChange={e => setFormData({ ...formData, unitId: e.target.value })}
              variant="outlined"
            >
              {floorList
                .filter(item => item.id === formData.floorId)
                .map(item =>
                  item.unit?.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {`${option.unitNum}单元`}
                    </MenuItem>
                  ))
                )}
            </TextField>
          </Box>
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof RoomParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.roomSubType}
              onChange={e => setFormData({ ...formData, roomSubType: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '110', label: '住宅' },
                { value: '120', label: '办公室' },
                { value: '119', label: '宿舍' },
                { value: '128', label: '储物间' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋状态：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '2001', label: '已入住' },
                { value: '2002', label: '未销售' },
                { value: '2003', label: '已交房' },
                { value: '2004', label: '未入住' },
                { value: '2005', label: '已装修' },
                { value: '2006', label: '已出租' },
                { value: '2007', label: '已出售' },
                { value: '2008', label: '空闲' },
                { value: '2009', label: '装修中' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenRoomDialog(false)}>
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
