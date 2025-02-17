import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolParams } from 'api/model/property/repair/repairPoolModel'
import { create, find } from 'modules/property/repair/repairPool'
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

interface FormDialogProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  repairObjType: number
  setRepairObjType: Dispatch<SetStateAction<number>>
  floorValue: string
  setFloorValue: Dispatch<SetStateAction<string>>
  unitValue: string
  setUnitValue: Dispatch<SetStateAction<string>>
  roomValue: string
  setRommValue: Dispatch<SetStateAction<string>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  openDialog,
  setOpenDialog,
  repairObjType,
  setRepairObjType,
  floorValue,
  setFloorValue,
  unitValue,
  setUnitValue,
  roomValue,
  setRommValue
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairSettingSlice)
  const { list: floorList } = useSelector((state: RootState) => state.HousingManagementSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<RepairPoolParams>({
    repairSettingId: '',
    tel: '',
    appointmentTime: new Date().toISOString().slice(0, 19),
    context: ''
  })

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        let params = { ...formData }
        if (repairObjType === 1) {
          params = { ...params, communityId: community?.id }
        } else if (repairObjType === 2) {
          params = { ...params, floorId: floorValue, communityId: community?.id }
        } else if (repairObjType === 3) {
          params = { ...params, unitId: unitValue, communityId: community?.id }
        } else if (repairObjType === 4) {
          params = { ...params, roomId: roomValue, communityId: community?.id }
        }
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('登记成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      dispatch,
      floorValue,
      formData,
      page.num,
      page.size,
      repairObjType,
      roomValue,
      setOpenDialog,
      unitValue
    ]
  )

  const formFields = [
    { label: '报修人', type: 'text', id: 'repairName', required: true },
    { label: '联系方式', type: 'text', id: 'tel', required: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>报修登记</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报修范围：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={repairObjType}
              onChange={e => setRepairObjType(Number(e.target.value))}
              variant="outlined"
            >
              {[
                { value: 1, label: '小区' },
                { value: 2, label: '楼栋' },
                { value: 3, label: '单元' },
                { value: 4, label: '房屋' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {(repairObjType as number) > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>归属楼栋：</FormLabel>
              <TextField
                placeholder="请选择"
                sx={{ width: '80%' }}
                select
                size="small"
                value={floorValue}
                onChange={e => setFloorValue(e.target.value)}
                variant="outlined"
              >
                {floorList.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {(repairObjType as number) > 2 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>归属单元：</FormLabel>
              <TextField
                placeholder="请选择"
                sx={{ width: '80%' }}
                select
                size="small"
                value={unitValue}
                onChange={e => setUnitValue(e.target.value)}
                variant="outlined"
              >
                {unitList.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.unitNum}单元
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {(repairObjType as number) > 3 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>归属房屋：</FormLabel>
              <TextField
                placeholder="请选择"
                sx={{ width: '80%' }}
                select
                size="small"
                value={roomValue}
                onChange={e => setRommValue(e.target.value)}
                variant="outlined"
              >
                {roomList.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.roomNum}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报修类型：</FormLabel>
            <TextField
              placeholder="请选择"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.repairSettingId}
              onChange={e => setFormData({ ...formData, repairSettingId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.repairTypeName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                placeholder="请输入"
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof RepairPoolParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>预约时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={
                formData.appointmentTime || new Date().toLocaleString('en-GB').replace(',', '')
              }
              onChange={e => setFormData({ ...formData, appointmentTime: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报修内容：</FormLabel>
            <TextField
              placeholder="请输入"
              sx={{ width: '80%' }}
              size="small"
              value={formData.context}
              onChange={e => setFormData({ ...formData, context: e.target.value })}
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
