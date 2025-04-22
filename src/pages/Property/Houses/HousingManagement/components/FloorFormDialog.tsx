import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import { FloorReply, FloorParams } from 'api/model/property/houses/floorModel'
import { create, find, update } from 'modules/property/houses/floor'
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
  dialogValue?: FloorReply
  openFloorDialog: boolean
  setOpenFloorDialog: Dispatch<SetStateAction<boolean>>
  dialogType: string
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openFloorDialog,
  setOpenFloorDialog,
  dialogType
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      floorNum: dialogType === 'edit' ? dialogValue?.floorNum || '' : '',
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      floorArea: dialogType === 'edit' ? dialogValue?.floorArea || '' : '',
      sort: dialogType === 'edit' ? dialogValue?.sort || 0 : 0,
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<FloorParams>(initialFormData)

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
        await dispatch(find({ 'page.disable': true }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenFloorDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dialogType, dialogValue?.id, dispatch, setOpenFloorDialog, initialFormData]
  )

  const formFields = [
    { label: '楼栋编号', type: 'text', id: 'floorNum', required: true },
    { label: '楼栋名称', type: 'text', id: 'name', required: true },
    { label: '建筑面积', type: 'text', id: 'floorArea', required: true },
    { label: '排序', type: 'text', id: 'sort', required: true },
    { label: '备注', type: 'text', id: 'remark', required: false }
  ]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openFloorDialog}
      onClose={() => setOpenFloorDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
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
                value={formData[id as keyof FloorParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenFloorDialog(false)}>
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
