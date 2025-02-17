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
  FormLabel,
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
      address: dialogType === 'edit' ? dialogValue?.address || '' : '',
      nearby_landmarks: dialogType === 'edit' ? dialogValue?.nearbyLandmarks || '' : '',
      city_code: dialogType === 'edit' ? dialogValue?.cityCode || '' : '',
      map_x: dialogType === 'edit' ? dialogValue?.mapX || '' : '',
      map_y: dialogType === 'edit' ? dialogValue?.mapY || '' : '',
      tel: dialogType === 'edit' ? dialogValue?.tel || '' : '',
      qr_code: dialogType === 'edit' ? dialogValue?.qrCode || '' : '',
      community_area: dialogType === 'edit' ? dialogValue?.communityArea || '' : ''
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
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, page, setOpenDialog, initialFormData]
  )

  const formFields = [
    { label: '小区名称', type: 'text', id: 'name', required: true, disabled: true },
    { label: '小区地址', type: 'text', id: 'address', required: true, disabled: true },
    { label: '小区地标', type: 'text', id: 'nearby_landmarks', required: true, disabled: true },
    { label: '城市编码', type: 'text', id: 'city_code', required: true, disabled: true },
    { label: '地区X坐标', type: 'text', id: 'map_x', required: true, disabled: true },
    { label: '地区Y坐标', type: 'text', id: 'map_y', required: true, disabled: true },
    { label: '客服电话', type: 'text', id: 'tel', required: true },
    { label: '客服二维码', type: 'text', id: 'qr_code', required: true },
    { label: '小区面积', type: 'text', id: 'community_area', required: true }
  ]

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
          {formFields.map(({ label, type, id, required, disabled }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                disabled={disabled}
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
