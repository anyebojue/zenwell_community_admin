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
  ReportCustomComponentParams,
  ReportCustomComponentReply
} from 'api/model/platform/reportConfiguration/reportCustomComponentModel'
import { create, find, update } from 'modules/platform/reportConfiguration/reportCustomComponent'
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
  dialogValue?: ReportCustomComponentReply
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
  const { page } = useSelector((state: RootState) => state.ReportCustomComponentSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(() => {
    const commonFields = {
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      componentType: dialogType === 'edit' ? dialogValue?.componentType || '' : '',
      queryModel: dialogType === 'edit' ? dialogValue?.queryModel || '1' : '1',
      goScript: dialogType === 'edit' ? dialogValue?.goScript || '' : '',
      componentSql: dialogType === 'edit' ? dialogValue?.componentSql || '' : '',
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : ''
    }

    return commonFields
  }, [dialogType, dialogValue])

  const [formData, setFormData] = useState<ReportCustomComponentParams>(initialFormData)

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
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, page, setOpenDialog, initialFormData]
  )

  const formFields = [{ label: '组件名称', type: 'text', id: 'name', required: true }]

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
                placeholder={`请输入${label}`}
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof ReportCustomComponentParams]}
                onChange={e => handleFormChange(id, e.target.value)}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>报表组：</FormLabel>
            <TextField
              label="请选择组件类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.componentType || ''}
              onChange={e => setFormData({ ...formData, componentType: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1001', label: '表格' },
                { value: '2002', label: '饼状图' },
                { value: '3003', label: 'input' },
                { value: '4004', label: 'select' },
                { value: '5005', label: '日期' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>查询方式：</FormLabel>
            <TextField
              label="请选择查询方式"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.queryModel || ''}
              onChange={e => setFormData({ ...formData, queryModel: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1', label: 'sql' },
                { value: '2', label: 'go' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {formData.queryModel === '1' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>sql：</FormLabel>
              <TextField
                placeholder="选填，请填写执行sql"
                sx={{ width: '80%' }}
                type="text"
                multiline
                rows={10}
                size="small"
                value={formData.componentSql}
                onChange={e => setFormData({ ...formData, componentSql: e.target.value })}
                variant="outlined"
              />
            </Box>
          ) : formData.queryModel === '2' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>go：</FormLabel>
              <TextField
                placeholder="选填，请填写执行go脚本代码"
                sx={{ width: '80%' }}
                type="text"
                multiline
                rows={10}
                size="small"
                value={formData.goScript}
                onChange={e => setFormData({ ...formData, goScript: e.target.value })}
                variant="outlined"
              />
            </Box>
          ) : (
            ''
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>备注：</FormLabel>
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
