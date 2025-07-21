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
  CarBlackWhiteParams,
  CarBlackWhiteReply
} from 'api/model/property/parking/carBlackWhiteModel'
import { create, find, update } from 'modules/property/parking/carBlackWhite'
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
  selectedButton: string
  dialogValue?: CarBlackWhiteReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  selectedButton,
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.CarBlackWhiteSlice)
  const { list } = useSelector((state: RootState) => state.ParkingAreaSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      blackWhite: dialogType === 'edit' ? dialogValue?.blackWhite || '' : '',
      paId: dialogType === 'edit' ? dialogValue?.paId || '' : '',
      carNum: dialogType === 'edit' ? dialogValue?.carNum || '' : '',
      startTime:
        dialogType === 'edit'
          ? dialogValue?.startTime || formatDateTime(new Date())
          : formatDateTime(new Date()),
      endTime:
        dialogType === 'edit'
          ? dialogValue?.endTime || formatDateTime(new Date())
          : formatDateTime(new Date())
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<CarBlackWhiteParams>(initialFormData)

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
        await dispatch(
          find({
            'page.num': page.num || '1',
            'page.size': page.size,
            ...(selectedButton && { blackWhite: selectedButton })
          })
        )
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
      dialogType,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      selectedButton,
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
            <FormLabel>名单类型：</FormLabel>
            <TextField
              label="请选择名单类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.blackWhite || ''}
              onChange={e => setFormData({ ...formData, blackWhite: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1111', label: '黑名单' },
                { value: '2222', label: '白名单' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>停车场：</FormLabel>
            <TextField
              label="请选择停车场"
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
            <FormLabel>开始时间：</FormLabel>
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
            <FormLabel>结束时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.startTime)}
              onChange={e => setFormData({ ...formData, endTime: formatDateTime(e.target.value) })}
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

export default memo(FormDialog)
