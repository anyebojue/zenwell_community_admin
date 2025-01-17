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
import { SpectionPlanParams, SpectionPlanReply } from 'api/model/property/spectionPlanModel'
import { create, find, update } from 'modules/property/spectionPlan'
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
  dialogValue?: SpectionPlanReply
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
  const { page } = useSelector((state: RootState) => state.SpectionPlanSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      inspectionPlanName: dialogType === 'edit' ? dialogValue?.inspectionPlanName || '' : '',
      inspectionRouteId: dialogType === 'edit' ? dialogValue?.inspectionRouteId || '' : '',
      inspectionPlanPeriod: dialogType === 'edit' ? dialogValue?.inspectionPlanPeriod || 0 : 0,
      beforeTime: dialogType === 'edit' ? dialogValue?.beforeTime || 0 : 0,
      startDate: dialogType === 'edit' ? dialogValue?.startDate || '' : '',
      endDate: dialogType === 'edit' ? dialogValue?.endDate || '' : '',
      startTime: dialogType === 'edit' ? dialogValue?.startTime || '' : '',
      endTime: dialogType === 'edit' ? dialogValue?.endTime || '' : '',
      signType: dialogType === 'edit' ? dialogValue?.signType || 0 : 0,
      canReexamine: dialogType === 'edit' ? dialogValue?.canReexamine || 0 : 0,
      createUserId: dialogType === 'edit' ? dialogValue?.createUserId || '' : ''
    }),
    [dialogType, dialogValue]
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

  const formFields = [{ label: '计划名称', type: 'text', id: 'inspectionPlanName', required: true }]

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
            <FormLabel>巡检路线：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.inspectionRouteId}
              onChange={e => setFormData({ ...formData, inspectionRouteId: e.target.value })}
              variant="outlined"
            >
              {[
                { value: 1, label: '月/天' },
                { value: 2, label: '按周' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>任务提前：</FormLabel>
            <TextField
              sx={{ width: '63%' }}
              size="small"
              value={formData.beforeTime}
              onChange={e => setFormData({ ...formData, beforeTime: Number(e.target.value) })}
              variant="outlined"
            />
            <FormLabel>分钟生成</FormLabel>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>巡检周期：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.inspectionPlanPeriod}
              onChange={e =>
                setFormData({ ...formData, inspectionPlanPeriod: Number(e.target.value) })
              }
              variant="outlined"
            >
              {[
                { value: 1, label: '月/天' },
                { value: 2, label: '按周' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始日期：</FormLabel>
            <TextField
              type="date"
              sx={{ width: '80%' }}
              size="small"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              variant="outlined"
            />
          </Box>
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
            <FormLabel>开始日期：</FormLabel>
            <TextField
              type="date"
              sx={{ width: '80%' }}
              size="small"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始时间：</FormLabel>
            <TextField
              type="time"
              sx={{ width: '80%' }}
              size="small"
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>签到方式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.signType}
              onChange={e => setFormData({ ...formData, signType: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '手动' },
                { value: 1, label: '自动' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>允许补检：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.canReexamine}
              onChange={e => setFormData({ ...formData, canReexamine: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '不允许' },
                { value: 1, label: '允许' }
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
