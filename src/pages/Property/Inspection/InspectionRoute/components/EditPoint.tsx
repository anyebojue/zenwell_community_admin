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
import { SpectionPlanParams } from 'api/model/property/spectionPlanModel'
import { createPoint, find } from 'modules/property/spectionPoint'
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
import { SpectionPointReply } from 'api/model/property/spectionPointModel'
import { SpectionRouteReply } from 'api/model/property/spectionRouteModel'

interface FormDialogProps {
  dialogValue: SpectionPointReply | undefined
  routeDialogValue: SpectionRouteReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  routeDialogValue,
  openDialog,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.SpectionPlanSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      sortNumber: dialogValue?.sortNumber || 0,
      startTime: dialogValue?.startTime || '',
      endTime: dialogValue?.endTime || ''
    }),
    [dialogValue]
  )
  const [formData, setFormData] = useState<SpectionPlanParams>(initialFormData)

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
          inspectionRouteId: routeDialogValue?.id,
          inspectionPointId: dialogValue?.id,
          communityId: community.id,
          status: dialogValue?.status
        }
        const action = createPoint(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('编辑成功')
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
      routeDialogValue?.id,
      dialogValue?.id,
      dialogValue?.status,
      dispatch,
      page.num,
      page.size,
      setOpenDialog,
      initialFormData
    ]
  )

  const formFields = [{ label: '排序', type: 'text', id: 'sortNumber', required: true }]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>修改巡检点</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                placeholder="请输入"
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof SpectionPlanParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始时间：</FormLabel>
            <TextField
              type="time"
              sx={{ width: '80%' }}
              size="small"
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束时间：</FormLabel>
            <TextField
              type="time"
              sx={{ width: '80%' }}
              size="small"
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
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
