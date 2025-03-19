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
import { ReportCustomComponentRelParams } from 'api/model/platform/reportConfiguration/reportCustomComponentRelModel'
import { create, find } from 'modules/platform/reportConfiguration/reportCustomComponentRel'
import { ReportCustomReply } from 'api/model/platform/reportConfiguration/reportCustomModel'
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
  valueData: ReportCustomReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ valueData, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ReportCustomComponentRelSlice)
  const { list } = useSelector((state: RootState) => state.ReportCustomComponentSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(() => {
    const commonFields = {
      componentId: '',
      seq: 0
    }

    return commonFields
  }, [])

  const [formData, setFormData] = useState<ReportCustomComponentRelParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleFormChange = (id: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const params = { ...formData, customId: valueData.id }
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({ 'page.num': page.num || '1', 'page.size': page.size, customId: valueData.id! })
        )
        message.success('关联成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dispatch, page.num, page.size, valueData.id, setOpenDialog, initialFormData]
  )

  const formFields = [{ label: '组件序号', type: 'text', id: 'seq', required: true }]

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>关联</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>组件：</FormLabel>
            <TextField
              placeholder="请选择组件"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.componentId || ''}
              onChange={e => setFormData({ ...formData, componentId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
                value={formData[id as keyof ReportCustomComponentRelParams]}
                onChange={e => handleFormChange(id, e.target.value)}
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
