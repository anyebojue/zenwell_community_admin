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
  ResourceStoreSpecificationParams,
  ResourceStoreSpecificationReply
} from 'api/model/property/purchase/resourceStoreSpecificationModel'
import { create, find, update } from 'modules/property/purchase/resourceStoreSpecification'
import { find as findStoreType } from 'modules/property/purchase/resourceStoreType'
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
  dialogValue?: ResourceStoreSpecificationReply
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
  const { page } = useSelector((state: RootState) => state.ResourceStoreSpecificationSlice)
  const { list: storeList } = useSelector((state: RootState) => state.StoreTypeSlice)
  const { list: storeTypeList } = useSelector((state: RootState) => state.ResourceStoreTypeSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      specName: dialogType === 'edit' ? dialogValue?.specName || '' : '',
      storeId: dialogType === 'edit' ? dialogValue?.storeId || '' : '',
      rstId: dialogType === 'edit' ? dialogValue?.rstId || '' : '',
      description: dialogType === 'edit' ? dialogValue?.description || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ResourceStoreSpecificationParams>(initialFormData)

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

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (formData.storeId) {
      fetchData(
        findStoreType,
        { 'page.num': page.num, 'page.size': page.size, storeId: formData.storeId },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, page.num, page.size, formData.storeId])

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
            <FormLabel>规格名称：</FormLabel>
            <TextField
              placeholder="必填，请填写规格名称"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.specName}
              onChange={e => setFormData({ ...formData, specName: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>商品类型：</FormLabel>
            <TextField
              placeholder="请选择商品类型"
              sx={{ width: '36%' }}
              select
              size="small"
              value={formData.storeId || ''}
              onChange={e => setFormData({ ...formData, storeId: e.target.value })}
              variant="outlined"
            >
              {storeList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              placeholder="请选择商品类型"
              sx={{ width: '37%' }}
              select
              size="small"
              value={formData.rstId || ''}
              onChange={e => setFormData({ ...formData, rstId: e.target.value })}
              variant="outlined"
            >
              {storeTypeList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>描述：</FormLabel>
            <TextField
              placeholder="请输入"
              sx={{ width: '80%' }}
              size="small"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              multiline
              rows={2}
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
