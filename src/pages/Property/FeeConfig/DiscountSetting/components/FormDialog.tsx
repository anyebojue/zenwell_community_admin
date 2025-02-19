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
import { FeeDiscountParams, FeeDiscountReply } from 'api/model/property/feeConfig/feeDiscountModel'
import { create, find, update } from 'modules/property/feeConfig/feeDiscount'
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
  dialogValue?: FeeDiscountReply
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
  const { page, list } = useSelector((state: RootState) => state.FeeDiscountRuleSlice)
  const { list: ruleSpecList } = useSelector((state: RootState) => state.FeeDiscountRuleSpecSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      discountType: dialogType === 'edit' ? dialogValue?.discountType || '' : '',
      ruleId: dialogType === 'edit' ? dialogValue?.ruleId || '' : '',
      feeDiscountSpec: dialogType === 'edit' ? dialogValue?.feeDiscountSpec || [] : []
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<FeeDiscountParams>(initialFormData)

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

  useEffect(() => {
    if (formData.ruleId) {
      const current_community = localStorage.getItem('current_community')
      const community = JSON.parse(current_community || '')
      const updatedSpec = ruleSpecList
        .filter(item => item.ruleId === formData.ruleId)
        .map(({ id, name, remark }) => {
          const existingSpec = formData.feeDiscountSpec?.find(spec => spec.specId === id)
          return {
            communityId: community?.id,
            specId: id,
            name,
            specValue: existingSpec ? existingSpec.specValue : '',
            status: existingSpec ? existingSpec.status : 1,
            remark
          }
        })
      if (JSON.stringify(updatedSpec) !== JSON.stringify(formData.feeDiscountSpec)) {
        setFormData(prev => ({
          ...prev,
          feeDiscountSpec: updatedSpec
        }))
      }
    }
  }, [formData.ruleId, formData.feeDiscountSpec, ruleSpecList])

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
            <FormLabel>折扣名称：</FormLabel>
            <TextField
              placeholder="必填，请填写折扣名称"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>折扣类型：</FormLabel>
            <TextField
              placeholder="请选择折扣类型"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.discountType || ''}
              onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1001', label: '优惠' },
                { value: '2002', label: '违约' },
                { value: '3003', label: '优惠(需要申请)' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>规则：</FormLabel>
            <TextField
              placeholder="请选择规则"
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.ruleId || ''}
              onChange={e => setFormData({ ...formData, ruleId: e.target.value })}
              variant="outlined"
            >
              {list
                .filter(item => item.discountSmallType === formData.discountType)
                .map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          {ruleSpecList
            .filter(item => item.ruleId === formData.ruleId)
            .map(({ name, id, remark }) => {
              const feeSpec = formData.feeDiscountSpec?.find(spec => spec.specId === id)
              return (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  key={id}
                >
                  <FormLabel>{name}：</FormLabel>
                  <TextField
                    placeholder={remark}
                    type="text"
                    sx={{ width: '80%' }}
                    size="small"
                    required
                    value={feeSpec?.specValue || ''}
                    onChange={e => {
                      const updatedSpecValue = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        feeDiscountSpec: prev.feeDiscountSpec?.map(spec =>
                          spec.specId === id ? { ...spec, specValue: updatedSpecValue } : spec
                        )
                      }))
                    }}
                  />
                </Box>
              )
            })}
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
