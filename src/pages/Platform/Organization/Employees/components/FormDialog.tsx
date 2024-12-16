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
import { EmployeesParams, EmployeesReply } from 'api/model/platform/employeesModel'
import { create, find, update } from 'modules/platform/employees'
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
  dialogValue?: EmployeesReply
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
  const { page } = useSelector((state: RootState) => state.EmployeesSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      username: dialogType === 'edit' ? dialogValue?.username || '' : '',
      position: dialogType === 'edit' ? dialogValue?.position || '' : '',
      mobile: dialogType === 'edit' ? dialogValue?.mobile || '' : '',
      sex: dialogType === 'edit' ? dialogValue?.sex || 0 : 0,
      idcard: dialogType === 'edit' ? dialogValue?.idcard || '' : '',
      address: dialogType === 'edit' ? dialogValue?.address || '' : '',
      org: dialogType === 'edit' ? dialogValue?.org || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<EmployeesParams>(initialFormData)

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
        const res = (await dispatch(action)) as PayloadActionWithError<EmployeesParams>
        if (res.meta.requestStatus === 'rejected' && res.error) {
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
    { label: '员工名称', type: 'text', id: 'username', required: true },
    { label: '员工岗位', type: 'text', id: 'position', required: true },
    { label: '手机', type: 'number', id: 'mobile', required: true },
    { label: '身份证', type: 'number', id: 'idcard', required: true },
    { label: '家庭住址', type: 'text', id: 'address', required: true },
    { label: '关联组织', type: 'text', id: 'org', required: true }
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
                value={formData[id as keyof EmployeesParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>平台：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.sex}
              onChange={e => setFormData({ ...formData, sex: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '女' },
                { value: 1, label: '男' }
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
