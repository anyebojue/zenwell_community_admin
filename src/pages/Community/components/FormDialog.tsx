import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, CircularProgress, FormControl, FormLabel, MenuItem, Stack } from '@mui/material'
import { create, find, update } from 'modules/community'
import { CommunityParams, CommunityReply } from 'api/model/communityModel'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'

interface FormDialogProps {
  dialogValue?: CommunityReply | undefined
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
      pay_fee_month: dialogType === 'edit' ? dialogValue?.payFeeMonth || '' : '',
      fee_price: dialogType === 'edit' ? dialogValue?.feePrice || 0 : 0,
      b_id: dialogType === 'edit' ? dialogValue?.bId || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<CommunityParams>(initialFormData)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        await dispatch(action)
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
    { label: '小区名称', id: 'name', required: true },
    { label: '小区地址', id: 'address', required: true },
    { label: '附近地标', id: 'nearby_landmarks', required: true },
    { label: '客服电话', id: 'tel', required: true },
    { label: '缴费周期', id: 'pay_fee_month', required: true },
    { label: '每月单价', id: 'fee_price', required: true },
    { label: '社区编码', id: 'b_id', required: true }
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
          {formFields.map(({ label, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
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
            {[
              {
                label: '省',
                value: formData.city_code,
                setter: (value: string) => setFormData({ ...formData, city_code: value })
              },
              {
                label: '市',
                value: formData.city_code,
                setter: (value: string) => setFormData({ ...formData, city_code: value })
              },
              {
                label: '县',
                value: formData.city_code,
                setter: (value: string) => setFormData({ ...formData, city_code: value })
              }
            ].map(({ label, value, setter }) => (
              <FormControl sx={{ width: '22%' }} variant="outlined" key={label}>
                <TextField
                  select
                  size="small"
                  label={`请选择${label}`}
                  value={value}
                  onChange={e => setter(e.target.value)}
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
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
