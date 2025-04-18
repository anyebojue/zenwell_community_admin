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
import { MeterWaterParams, MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'
import { create, find, update } from 'modules/property/feeConfig/meterWater'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
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
import { RoomReply } from 'api/model/property/houses/roomModel'

interface FormDialogProps {
  dialogValue?: { id?: string; label?: string; roomData?: RoomReply }
  dialogMeterWaterValue: MeterWaterReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  dialogMeterWaterValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FloorSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      preDegrees: dialogMeterWaterValue?.preDegrees || 0,
      curDegrees: dialogMeterWaterValue?.curDegrees || 0,
      remark: dialogMeterWaterValue?.remark || ''
    }),
    [dialogMeterWaterValue]
  )
  const [formData, setFormData] = useState<MeterWaterParams>(initialFormData)

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    setFormData(initialFormData)
    if (dialogType === 'code') {
      fetchData(
        findFeeConfig,
        { 'page.disable': true, feeTypeCd: formData.feeId || '' },
        '正在加载列表中，请稍后...'
      )
      fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [dialogType, fetchData, formData.feeId, initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action =
          dialogType === 'add'
            ? create(params)
            : update({ id: dialogMeterWaterValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogMeterWaterValue, formData, page, setOpenDialog, initialFormData]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'sign' ? '催缴登记' : '催缴欠费'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {dialogType === 'sign' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>登记房屋：</FormLabel>
              <TextField
                disabled
                required
                placeholder="请输入登记房屋"
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={`${dialogValue?.roomData?.roomNum} - ${dialogValue?.roomData?.unit?.unitNum} - ${dialogValue?.roomData?.unit?.floor?.floorNum}`}
                variant="outlined"
              />
            </Box>
          )}
          {dialogType === 'payment' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>催缴方式：</FormLabel>
              <TextField
                placeholder="请选择催缴方式"
                sx={{ width: '80%' }}
                select
                size="small"
                value={formData.feeId}
                onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                variant="outlined"
              >
                {[
                  { value: 'WECHAT', label: '微信模板消息' },
                  { value: 'SMS', label: '短信' },
                  { value: 'EXCEL', label: '导出' },
                  { value: 'TTS', label: '呼电话催缴' }
                ].map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {dialogType === 'payment' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>楼栋：</FormLabel>
                <TextField
                  placeholder="请选择楼栋"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.meterType}
                  onChange={e => setFormData({ ...formData, meterType: e.target.value })}
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
                <FormLabel>应收时间段：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.feeId}
                  onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                  variant="outlined"
                >
                  {[
                    { value: 'OFF', label: '否' },
                    { value: 'ON', label: '是' }
                  ].map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>欠费房屋：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.feeId}
                  onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                  variant="outlined"
                >
                  {[
                    { value: 'OFF', label: '否' },
                    { value: 'ON', label: '是' }
                  ].map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </>
          )}
          {dialogType === 'sign' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>催缴说明：</FormLabel>
              <TextField
                required
                placeholder="请输入催缴说明"
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
          )}
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
