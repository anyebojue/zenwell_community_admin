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
import { ReleaseParams, ReleaseReply } from 'api/model/property/communitys/releaseModel'
import { create, find, update } from 'modules/property/communitys/release'
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
  IconButton,
  MenuItem
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { Add, Delete } from '@mui/icons-material'

const formatDateTime = (date: Date | string | undefined): string => {
  const validDate = date ? new Date(date) : new Date()
  const year = validDate.getFullYear()
  const month = String(validDate.getMonth() + 1).padStart(2, '0')
  const day = String(validDate.getDate()).padStart(2, '0')
  const hours = String(validDate.getHours()).padStart(2, '0')
  const minutes = String(validDate.getMinutes()).padStart(2, '0')
  const seconds = String(validDate.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

interface FormDialogProps {
  dialogValue?: ReleaseReply
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
  const { page, list } = useSelector((state: RootState) => state.ReleaseTypeSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      typeId: dialogType === 'edit' ? dialogValue?.typeId || '' : '',
      applyCompany: dialogType === 'edit' ? dialogValue?.applyCompany || '' : '',
      applyPerson: dialogType === 'edit' ? dialogValue?.applyPerson || '' : '',
      idCard: dialogType === 'edit' ? dialogValue?.idCard || '' : '',
      applyTel: dialogType === 'edit' ? dialogValue?.applyTel || '' : '',
      carNum: dialogType === 'edit' ? dialogValue?.carNum || '' : '',
      passTime:
        dialogType === 'edit'
          ? dialogValue?.passTime || formatDateTime(new Date())
          : formatDateTime(new Date()),
      remark: dialogType === 'edit' ? dialogValue?.remark || '' : '',
      releaseRes:
        dialogType === 'edit' &&
        Array.isArray(dialogValue?.releaseRes) &&
        dialogValue.releaseRes.length >= 1
          ? dialogValue.releaseRes
          : [{ resName: '', amount: '' }]
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ReleaseParams>(initialFormData)

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
          dialogType === 'add'
            ? create({ ...params, statusCd: 'W' })
            : update({ id: dialogValue?.id, ...params })
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

  const addOption = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      releaseRes: Array.isArray(prev.releaseRes)
        ? [...prev.releaseRes, { resName: '', amount: '' }]
        : [{ resName: '', amount: '' }]
    }))
  }, [])

  const deleteOption = useCallback((index: number) => {
    setFormData(prev => {
      if (!Array.isArray(prev.releaseRes)) {
        return prev
      }
      const updated = prev.releaseRes.filter((_, i) => i !== index)
      return {
        ...prev,
        releaseRes: updated.length >= 1 ? updated : prev.releaseRes
      }
    })
  }, [])

  const formFields = [
    { label: '申请单位', type: 'text', id: 'applyCompany', required: true },
    { label: '申请人', type: 'text', id: 'applyPerson', required: true },
    { label: '身份证', type: 'text', id: 'idCard', required: true },
    { label: '手机号', type: 'text', id: 'applyTel', required: true },
    { label: '车牌号', type: 'text', id: 'carNum', required: true },
    { label: '备注', type: 'text', id: 'remark', required: true }
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.typeId}
              onChange={e => setFormData({ ...formData, typeId: e.target.value })}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.typeName}
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
                placeholder="请输入"
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof ReleaseParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>通行时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.passTime)}
              onChange={e => setFormData({ ...formData, passTime: formatDateTime(e.target.value) })}
              variant="outlined"
            />
          </Box>
          {formData.releaseRes?.map((item, index) => (
            <Box
              key={index + 1}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <FormLabel>物品名称：</FormLabel>
                <TextField
                  placeholder="物品名称"
                  sx={{
                    marginLeft: '37px'
                  }}
                  size="small"
                  value={item.resName}
                  onChange={e => {
                    if (Array.isArray(formData.releaseRes)) {
                      const updatedOptions = formData.releaseRes.map((option, idx) =>
                        idx === index ? { ...option, resName: e.target.value } : option
                      )
                      setFormData({ ...formData, releaseRes: updatedOptions })
                    }
                  }}
                  variant="outlined"
                />
                <TextField
                  placeholder="数量"
                  sx={{ width: '20%', ml: 1 }}
                  size="small"
                  value={item.amount}
                  onChange={e => {
                    if (Array.isArray(formData.releaseRes)) {
                      const updatedOptions = [...formData.releaseRes]
                      updatedOptions[index].amount = e.target.value
                      setFormData({ ...formData, releaseRes: updatedOptions })
                    }
                  }}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {index === (formData.releaseRes?.length ?? 0) - 1 && (
                  <IconButton aria-label="add" size="medium" onClick={addOption}>
                    <Add fontSize="inherit" />
                  </IconButton>
                )}
                {(formData.releaseRes?.length ?? 0) > 1 && (
                  <IconButton
                    aria-label="delete"
                    size="medium"
                    sx={{ ml: 1 }}
                    onClick={() => deleteOption(index)}
                  >
                    <Delete fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
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
