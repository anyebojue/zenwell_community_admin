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
  ApplyRoomDiscountTypeParams,
  ApplyRoomDiscountTypeReply
} from 'api/model/property/feeConfig/applyRoomDiscountTypeModel'
import { create, find, update } from 'modules/property/feeConfig/applyRoomDiscountType'
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
  dialogValue?: ApplyRoomDiscountTypeReply
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
  const { page } = useSelector((state: RootState) => state.ApplyRoomDiscountTypeSlice)

  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ApplyRoomDiscountTypeParams>(initialFormData)

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
            <FormLabel>类型名称：</FormLabel>
            <TextField
              placeholder="必填，请填写折扣名称"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>类型描述：</FormLabel>
            <TextField
              placeholder="选填，请填写说明"
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
