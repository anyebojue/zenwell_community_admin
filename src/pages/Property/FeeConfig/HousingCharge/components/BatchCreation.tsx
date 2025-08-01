import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { PayFeesBatchParams } from 'api/model/property/feeConfig/payFeeModel'
import { find, payFeesBatch } from 'modules/property/feeConfig/payFee'

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
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  payerObjType: number
  setPayerObjType: Dispatch<SetStateAction<number>>
  feeTypeCd: string
  setFeeTypeCd: Dispatch<SetStateAction<string>>
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
  payerObjType,
  setPayerObjType,
  feeTypeCd,
  setFeeTypeCd,
  floorValue,
  setFloorValue,
  unitValue,
  setUnitValue,
  roomValue,
  setRommValue
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.PayFeeSlice)
  const { list: floorList } = useSelector((state: RootState) => state.FloorSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const { list: roomList } = useSelector((state: RootState) => state.RoomSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PayFeesBatchParams>({
    payerObjType: '1010301',
    payerObjId: '',
    payerObjName: '',
    feeTypeCd: '',
    configId: '',
    statusCd: '',
    startTime: formatDateTime(new Date()),
    endTime: formatDateTime(new Date())
  })

  const [statusCds, setStatusCds] = useState<string[]>([])

  const toggleStatus = (value: string) => {
    setStatusCds(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]))
  }

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '{}')

        const payerObjId =
          payerObjType === 1
            ? '-1'
            : payerObjType === 2
              ? floorValue
              : payerObjType === 3
                ? unitValue
                : payerObjType === 4
                  ? roomValue
                  : ''

        const payerObjName =
          payerObjType === 1
            ? '-1'
            : payerObjType === 2
              ? floorList.find(item => item.id === floorValue)?.name || ''
              : payerObjType === 3
                ? unitList.find(item => item.id === unitValue)?.unitNum || ''
                : payerObjType === 4
                  ? roomList.find(item => item.id === roomValue)?.roomNum || ''
                  : ''

        const params = {
          communityId: community.id,
          payerObjType,
          payerObjId,
          payerObjName,
          feeTypeCd,
          configId: formData.configId,
          statusCd: statusCds.join(','),
          startTime: formData.startTime,
          endTime: formData.endTime
        }
        console.log(params)
        const res = await dispatch(payFeesBatch(params))
        if ('error' in res && res.error?.message) throw new Error(res.error.message)
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('批量创建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      payerObjType,
      floorValue,
      unitValue,
      roomValue,
      floorList,
      unitList,
      roomList,
      feeTypeCd,
      formData.configId,
      formData.startTime,
      formData.endTime,
      statusCds,
      dispatch,
      page.num,
      page.size,
      setOpenDialog
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
      <DialogTitle>创建费用</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋类型：</FormLabel>
            <TextField
              select
              size="small"
              sx={{ width: '80%' }}
              variant="outlined"
              value={formData.payerObjType}
              onChange={e => setFormData({ ...formData, payerObjType: e.target.value })}
            >
              <MenuItem value="1010301">普通房屋</MenuItem>
              <MenuItem value="2020602">商铺</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>收费范围：</FormLabel>
            <TextField
              select
              size="small"
              sx={{ width: '80%' }}
              variant="outlined"
              value={payerObjType}
              onChange={e => setPayerObjType(+e.target.value)}
            >
              <MenuItem value={1}>小区</MenuItem>
              <MenuItem value={2}>楼栋</MenuItem>
              <MenuItem value={3}>单元</MenuItem>
              <MenuItem value={4}>房屋/商铺</MenuItem>
            </TextField>
          </Box>

          {payerObjType > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>楼栋：</FormLabel>
              <TextField
                select
                size="small"
                sx={{ width: '80%' }}
                value={floorValue}
                onChange={e => setFloorValue(e.target.value)}
              >
                {floorList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {payerObjType > 2 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>单元：</FormLabel>
              <TextField
                select
                size="small"
                sx={{ width: '80%' }}
                value={unitValue}
                onChange={e => setUnitValue(e.target.value)}
              >
                {unitList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.unitNum}单元
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {payerObjType > 3 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>房屋：</FormLabel>
              <TextField
                select
                size="small"
                sx={{ width: '80%' }}
                value={roomValue}
                onChange={e => setRommValue(e.target.value)}
              >
                {roomList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.roomNum}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用类型：</FormLabel>
            <TextField
              select
              size="small"
              sx={{ width: '80%' }}
              value={feeTypeCd}
              onChange={e => setFeeTypeCd(e.target.value)}
            >
              {feeConfigTypeList.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>收费项目：</FormLabel>
            <TextField
              select
              size="small"
              sx={{ width: '80%' }}
              value={formData.configId}
              onChange={e => setFormData({ ...formData, configId: e.target.value })}
            >
              {feeConfigList.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormLabel sx={{ width: '27%' }}>房屋状态：</FormLabel>
            <FormGroup row>
              {[
                { value: '2001', label: '已入住' },
                { value: '2003', label: '已交房' },
                { value: '2004', label: '未入住' },
                { value: '2005', label: '已装修' },
                { value: '2006', label: '已出租' },
                { value: '2007', label: '已出售' }
              ].map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={statusCds.includes(value)}
                      onChange={() => toggleStatus(value)}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>计费起始时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formData.startTime}
              onChange={e =>
                setFormData({ ...formData, startTime: formatDateTime(e.target.value) })
              }
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>计费结束时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: formatDateTime(e.target.value) })}
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
