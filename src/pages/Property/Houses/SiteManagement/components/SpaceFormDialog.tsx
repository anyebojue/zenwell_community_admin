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
import { SpaceReply, SpaceParams } from 'api/model/property/houses/spaceModel'
import { create, find, update } from 'modules/property/houses/space'
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
import { VenueReply } from 'api/model/property/houses/venueModel'

interface FormDialogProps {
  dialogValue?: VenueReply
  dialogSpaceValue?: SpaceReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  dialogSpaceValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogSpaceValue?.name || '' : '',
      feeMoney: dialogType === 'edit' ? dialogSpaceValue?.feeMoney || 0 : 0,
      adminName: dialogType === 'edit' ? dialogSpaceValue?.adminName || '' : '',
      tel: dialogType === 'edit' ? dialogSpaceValue?.tel || '' : '',
      stateCd: dialogType === 'edit' ? dialogSpaceValue?.stateCd || 0 : 0
    }),
    [dialogType, dialogSpaceValue]
  )
  const [formData, setFormData] = useState<SpaceParams>(initialFormData)

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
        const params = {
          ...formData,
          communityId: community.id,
          venueId: dialogValue?.id
        }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogSpaceValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ venueId: dialogValue?.id }))
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
      dialogValue?.id,
      dialogType,
      dialogSpaceValue?.id,
      dispatch,
      setOpenDialog,
      initialFormData
    ]
  )

  const formFields = [
    { label: '名称', type: 'text', id: 'name', required: true },
    { label: '每小时费用', type: 'text', id: 'feeMoney', required: true },
    { label: '管理员', type: 'text', id: 'adminName', required: true },
    { label: '管理员电话', type: 'text', id: 'tel', required: true }
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
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                disabled={id === 'pId'}
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof SpaceParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>状态：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.stateCd}
              onChange={e => setFormData({ ...formData, stateCd: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 1, label: '可预约' },
                { value: 2, label: '不可预约' }
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
