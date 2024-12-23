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
import {
  OrganizationInfoParams,
  OrganizationInfoReply
} from 'api/model/platform/organizationInfoModel'
import { create, find, update } from 'modules/platform/organizationInfo'
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
  dialogValue?: OrganizationInfoReply
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
  const { list } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [loading, setLoading] = useState(false)

  // 递归查找父级名称
  const findParentNameByPId = useCallback(
    (data: OrganizationInfoReply[], pId: string): string | null => {
      for (const item of data) {
        if (item.id === pId) {
          return item.name as string
        }
        if (item.children && item.children.length > 0) {
          const parentName = findParentNameByPId(item.children, pId)
          if (parentName) {
            return parentName
          }
        }
      }
      return null
    },
    []
  )

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      pId:
        dialogType === 'edit'
          ? findParentNameByPId(list, dialogValue?.pId || '') || dialogValue?.pId
          : dialogValue?.name,
      description: dialogType === 'edit' ? dialogValue?.description || '' : '',
      plate: dialogType === 'edit' ? dialogValue?.plate || '' : ''
    }),
    [dialogType, dialogValue, findParentNameByPId, list]
  )
  const [formData, setFormData] = useState<OrganizationInfoParams>(initialFormData)

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
          pId: dialogType === 'add' ? dialogValue?.id : dialogValue?.pId
        }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ pId: '0' }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, setOpenDialog, initialFormData]
  )

  const formFields = [
    { label: '组织名称', type: 'text', id: 'name', required: true },
    { label: '上级组织', type: 'text', id: 'pId', required: true },
    { label: '组织描述', type: 'text', id: 'description', required: true }
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
          {formFields.map(({ label, type, id, required }) =>
            id === 'pId' && formData.pId === '0' ? null : (
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
                  value={formData[id as keyof OrganizationInfoParams]}
                  onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                />
              </Box>
            )
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>平台：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.plate}
              onChange={e => setFormData({ ...formData, plate: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '0', label: '物业' },
                { value: '1', label: '平台' },
                { value: '2', label: '开发' }
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
