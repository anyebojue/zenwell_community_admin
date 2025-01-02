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
import { UnitParams, UnitReply } from 'api/model/property/unitModel'
import { create, update } from 'modules/property/unit'
import { find } from 'modules/property/housingManagement'
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
  dialogValue?: UnitReply
  openUnitDialog: boolean
  dialogType: string
  setOpenUnitDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openUnitDialog,
  dialogType,
  setOpenUnitDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(() => {
    const defaultValues = {
      unitNum: dialogType === 'edit' ? dialogValue?.unitNum || '' : '',
      layerCount: dialogType === 'edit' ? dialogValue?.layerCount || 0 : 0,
      unitArea: dialogType === 'edit' ? dialogValue?.unitArea || '' : '',
      lift: dialogType === 'edit' ? dialogValue?.lift || '' : '',
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }
    return defaultValues
  }, [dialogType, dialogValue])

  const [formData, setFormData] = useState<UnitParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = {
          ...formData,
          userId: info.id,
          floorId: dialogType === 'add' ? dialogValue?.id : dialogValue?.floorId
        }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.disable': true }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenUnitDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      formData,
      info.id,
      dialogValue?.floorId,
      dialogValue?.id,
      dialogType,
      dispatch,
      setOpenUnitDialog,
      initialFormData
    ]
  )

  const formFields = [
    { label: '单元编号', type: 'text', id: 'unitNum', required: true },
    { label: '总层数', type: 'text', id: 'layerCount', required: true },
    { label: '建筑面积', type: 'text', id: 'unitArea', required: true },
    { label: '备注', type: 'text', id: 'remark', required: true }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openUnitDialog}
      onClose={() => setOpenUnitDialog(false)}
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
                value={formData[id as keyof UnitParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>电梯：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.lift}
              onChange={e => setFormData({ ...formData, lift: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '0', label: '无' },
                { value: '1', label: '有' }
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
        <Button variant="contained" color="error" onClick={() => setOpenUnitDialog(false)}>
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
