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
import { CommunityParams, CommunityReply } from 'api/model/platform/communityModel'
import { create, find, update } from 'modules/platform/community'
import {
  Box,
  CircularProgress,
  FormControl,
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
  dialogValue?: CommunityReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const city = [{ value: '0', label: '北京' }]

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CommunitySlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      city_code: dialogType === 'edit' ? dialogValue?.cityCode || '' : '',
      address: dialogType === 'edit' ? dialogValue?.address || '' : '',
      nearby_landmarks: dialogType === 'edit' ? dialogValue?.nearbyLandmarks || '' : '',
      tel: dialogType === 'edit' ? dialogValue?.tel || '' : '',
      pay_fee_month: dialogType === 'edit' ? dialogValue?.payFeeMonth || 0 : 0,
      fee_price: dialogType === 'edit' ? dialogValue?.feePrice || 0 : 0,
      b_id: dialogType === 'edit' ? dialogValue?.bId || '' : '',
      state: dialogType === 'edit' ? dialogValue?.state || '0' : '0'
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<CommunityParams>(initialFormData)

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
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, page, setOpenDialog, initialFormData]
  )

  const formFields = [
    { label: '小区名称', type: 'text', id: 'name', required: true },
    { label: '小区地址', type: 'text', id: 'address', required: true },
    { label: '附近地标', type: 'text', id: 'nearby_landmarks', required: true },
    { label: '客服电话', type: 'text', id: 'tel', required: true },
    { label: '缴费周期', type: 'number', id: 'pay_fee_month', required: true },
    { label: '每月单价', type: 'number', id: 'fee_price', required: true },
    { label: '社区编码', type: 'text', id: 'b_id', required: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
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
                value={formData[id as keyof CommunityParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>小区地区：</FormLabel>
            {['省', '市', '县'].map(label => (
              <FormControl sx={{ width: '22%' }} variant="outlined" key={label}>
                <TextField
                  select
                  size="small"
                  label={`请选择${label}`}
                  value={formData.city_code}
                  onChange={e => setFormData({ ...formData, city_code: e.target.value })}
                  variant="outlined"
                >
                  {city.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            ))}
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
