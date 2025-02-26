import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  memo,
  useEffect,
  useMemo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeParams } from 'api/model/property/feeConfig/payFeeModel'
import { find, create } from 'modules/property/feeConfig/payFee'
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
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { find as findMeterType } from 'modules/property/feeConfig/meterType'

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

interface FormMeterReadingProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormMeterReading: React.FC<FormMeterReadingProps> = ({
  dialogValue,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.MeterTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const [loading, setLoading] = useState(false)
  const initialFormData = useMemo(
    () => ({
      feeTypeCd: '',
      configId: '',
      payerObjId: `${dialogValue?.roomData?.roomNum} - ${dialogValue?.roomData?.unit?.unitNum} - ${dialogValue?.roomData?.unit?.floor?.floorNum}`,
      amount: 0,
      startTime: formatDateTime(new Date()),
      endTime: formatDateTime(new Date())
    }),
    [dialogValue]
  )
  const [formData, setFormData] = useState<PayFeeParams>(initialFormData)

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
    if (openDialog) {
      fetchData(findFeeConfig, { 'page.disable': true }, '正在加载列表中，请稍后...')
      fetchData(findMeterType, { 'page.disable': true }, '正在加载列表中，请稍后...')
      fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [
    dialogValue.roomData?.roomNum,
    dialogValue.roomData?.unit?.floor?.floorNum,
    dialogValue.roomData?.unit?.unitNum,
    fetchData,
    initialFormData,
    openDialog,
    page.num,
    page.size
  ])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id }
        const action = create({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': '20' }))
        message.success('创建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        message.error(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogValue, formData, page, setOpenDialog]
  )

  const formFields = [
    { label: '收费对象', id: 'payerObjId', disabled: true },
    { label: '收费金额', id: 'amount' }
  ]

  const handleFormDataChange = (id: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev }
      if (id.startsWith('meterWater.')) {
        const meterKey = id.split('.')[1] as keyof typeof prev.meterWater
        newFormData.meterWater = {
          ...prev.meterWater,
          [meterKey]: value
        }
      } else {
        ;(newFormData as unknown as Record<keyof PayFeeParams, string>)[id as keyof PayFeeParams] =
          value
      }
      return newFormData
    })
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>费用取消申请</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeTypeCd}
              onChange={e => handleFormDataChange('feeTypeCd', e.target.value)}
              variant="outlined"
            >
              {feeConfigTypeList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>收费项目：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.configId}
              onChange={e => handleFormDataChange('configId', e.target.value)}
              variant="outlined"
            >
              {feeConfigList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {formFields.map(({ label, id, disabled }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                disabled={disabled}
                type="text"
                sx={{ width: '80%' }}
                size="small"
                id={id}
                value={formData[id as keyof PayFeeParams]}
                onChange={e => handleFormDataChange(id, e.target.value)}
                required
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.startTime)}
              onChange={e => handleFormDataChange('startTime', formatDateTime(e.target.value))}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.endTime)}
              onChange={e => handleFormDataChange('endTime', formatDateTime(e.target.value))}
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

export default memo(FormMeterReading)
