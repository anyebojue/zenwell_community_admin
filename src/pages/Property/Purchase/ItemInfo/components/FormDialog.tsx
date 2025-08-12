import React, { Dispatch, SetStateAction, useCallback, useEffect, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { create, find, update } from 'modules/property/purchase/resourceStore'
import { find as findStoreType } from 'modules/property/purchase/resourceStoreType'
import {
  CircularProgress,
  FormLabel,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Box
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import {
  ResourceStoreParams,
  ResourceStoreReply
} from 'api/model/property/purchase/resourceStoreModel'

interface FormDialogProps {
  dialogValue?: ResourceStoreReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const UNIT_OPTIONS = [
  { value: '1001', label: '个' },
  { value: '1002', label: '次' },
  { value: '1003', label: '米' },
  { value: '1004', label: '台' },
  { value: '1005', label: '副' },
  { value: '1006', label: '把' },
  { value: '1007', label: '套' },
  { value: '1008', label: '平米' },
  { value: '1009', label: '条/次' },
  { value: '1010', label: '套/次' },
  { value: '1011', label: '个/次' },
  { value: '1012', label: '盒' },
  { value: '1013', label: '箱' },
  { value: '1014', label: '瓶' },
  { value: '1015', label: '卷' },
  { value: '1016', label: '张' },
  { value: '1017', label: '桶' },
  { value: '1018', label: '只' },
  { value: '1019', label: '支' },
  { value: '1020', label: '片' },
  { value: '1021', label: '条' },
  { value: '1022', label: '根' },
  { value: '1023', label: '块' },
  { value: '1024', label: '吨' },
  { value: '1025', label: '节' },
  { value: '1026', label: '件' },
  { value: '1027', label: '本' },
  { value: '1028', label: '提' },
  { value: '1029', label: '袋' },
  { value: '1030', label: '辆' },
  { value: '1031', label: '双' },
  { value: '1032', label: '公斤' },
  { value: '1033', label: '包' },
  { value: '1034', label: '克' },
  { value: '1035', label: '部' },
  { value: '1036', label: '匹' },
  { value: '1037', label: '升' }
]

const FIXED_OPTIONS = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' },
  { value: 'T', label: '通用' }
]

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ResourceStoreSlice)
  const { list: storehouseList } = useSelector((state: RootState) => state.StorehouseSlice)
  const { list: storeList } = useSelector((state: RootState) => state.StoreTypeSlice)
  const { list: storeTypeList } = useSelector((state: RootState) => state.ResourceStoreTypeSlice)
  const { list: storeSpecificationList } = useSelector(
    (state: RootState) => state.ResourceStoreSpecificationSlice
  )

  const [loading, setLoading] = useState(false)

  const getInitialFormData = useCallback((): ResourceStoreParams => {
    const isEdit = dialogType === 'edit'
    return {
      resName: isEdit ? (dialogValue?.resName ?? '') : '',
      resCode: isEdit ? (dialogValue?.resCode ?? '') : '',
      storeId: isEdit ? (dialogValue?.storeId ?? '') : '',
      rstId: isEdit ? (dialogValue?.rstId ?? '') : '',
      unitCode: isEdit ? (dialogValue?.unitCode ?? '') : '',
      isFixed: isEdit ? (dialogValue?.isFixed ?? 'N') : 'N',
      rssId: isEdit ? (dialogValue?.rssId ?? '') : '',
      shId: isEdit ? (dialogValue?.shId ?? '') : '',
      price: isEdit ? (dialogValue?.price ?? 0) : 0,
      warningStock: isEdit ? (dialogValue?.warningStock ?? 10) : 10,
      miniUnitCode: isEdit ? (dialogValue?.miniUnitCode ?? 1001) : 1001,
      miniStock: isEdit ? (dialogValue?.miniStock ?? '1') : '1',
      outLowPrice: isEdit ? (dialogValue?.outLowPrice ?? 0) : 0,
      outHighPrice: isEdit ? (dialogValue?.outHighPrice ?? 0) : 0,
      description: isEdit ? (dialogValue?.description ?? '') : '',
      remark: isEdit ? (dialogValue?.remark ?? '') : '',
      img: isEdit ? (dialogValue?.img ?? '') : ''
    }
  }, [dialogType, dialogValue])

  const [formData, setFormData] = useState<ResourceStoreParams>(getInitialFormData)

  useEffect(() => {
    setFormData(getInitialFormData())
  }, [dialogValue, dialogType, getInitialFormData])

  const handleChange = useCallback(
    <K extends keyof ResourceStoreParams>(key: K, parser?: (v: string) => ResourceStoreParams[K]) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = parser ? parser(e.target.value) : e.target.value
        setFormData(prev => ({ ...prev, [key]: value }))
      },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
      try {
        const community = JSON.parse(localStorage.getItem('current_community') || '{}')
        const params = { ...formData, communityId: community?.id }
        const action =
          dialogType === 'add'
            ? create({ stock: '0', ...params })
            : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) throw new Error(res.error.message)
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
      } catch (error) {
        if (error instanceof Error) message.error(error.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogType, dialogValue, formData, page, setOpenDialog]
  )

  useEffect(() => {
    if (!formData.storeId) return
    const fetchStoreType = async () => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(
          findStoreType({ 'page.num': page.num, 'page.size': page.size, storeId: formData.storeId })
        )
        if ('error' in res && res.error?.message) throw new Error(res.error.message)
      } catch (error) {
        if (error instanceof Error) message.error(error.message)
      } finally {
        closeLoading()
      }
    }
    fetchStoreType()
  }, [dispatch, formData.storeId, page.num, page.size])

  const renderField = (
    label: string,
    key: keyof ResourceStoreParams,
    type: 'text' | 'number' | 'select' | 'textarea',
    options?: { value: string | number; label: string }[],
    extraProps?: Record<string, unknown>
  ) => {
    const parseNumber = (v: string) => {
      const n = Number(v)
      return isNaN(n) ? '' : n
    }
    const value = formData[key] ?? ''
    const onChangeHandler = type === 'number' ? handleChange(key, parseNumber) : handleChange(key)

    const commonProps = {
      size: 'small' as const,
      value,
      onChange: onChangeHandler,
      fullWidth: true,
      ...extraProps
    }

    return (
      <Stack direction="row" alignItems="center" spacing={1} flex={1} key={key}>
        <FormLabel sx={{ whiteSpace: 'nowrap', minWidth: 80 }}>{label}</FormLabel>
        {type === 'select' ? (
          <TextField label="请选择" select {...commonProps}>
            {options?.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            {...commonProps}
            type={type === 'number' ? 'number' : 'text'}
            multiline={type === 'textarea'}
            rows={type === 'textarea' ? 2 : undefined}
          />
        )}
      </Stack>
    )
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ mx: 1 }}>
        <Stack spacing={3}>
          <Box display="flex" gap={2}>
            {renderField('物品名称：', 'resName', 'text', undefined, {
              placeholder: '必填，请填写物品名称'
            })}
            {renderField('物品编码：', 'resCode', 'text', undefined, {
              placeholder: '必填，请填写物品编码'
            })}
          </Box>
          <Box display="flex" gap={2}>
            {renderField(
              '物品类型：',
              'storeId',
              'select',
              storeList.map(s => ({ value: s.id!, label: s.name! }))
            )}
            {renderField(
              '二级分类：',
              'rstId',
              'select',
              storeTypeList.map(s => ({ value: s.id!, label: s.name! }))
            )}
          </Box>
          <Box display="flex" gap={3}>
            {renderField('物品单位：', 'unitCode', 'select', UNIT_OPTIONS)}
            {renderField('固定物品：', 'isFixed', 'select', FIXED_OPTIONS)}
          </Box>
          <Box display="flex" gap={3}>
            {renderField(
              '物品规格：',
              'rssId',
              'select',
              storeSpecificationList.map(s => ({ value: s.id!, label: s.specName! }))
            )}
            {renderField(
              '仓库：',
              'shId',
              'select',
              storehouseList.map(s => ({ value: s.id!, label: s.shName! }))
            )}
          </Box>
          <Box display="flex" gap={3}>
            {renderField('参考价格：', 'price', 'number')}
            {renderField('警告库存：', 'warningStock', 'number')}
          </Box>
          <Box display="flex" gap={3}>
            {renderField('最小计量单位：', 'miniUnitCode', 'select', UNIT_OPTIONS, {
              helperText: '例：1盒钉子50个，物品单位为盒（1盒）， 最小计量单位为个（50个）。'
            })}
            {renderField('最小计量数量：', 'miniStock', 'text')}
          </Box>
          <Box display="flex" gap={3}>
            {renderField('最低收费标准：', 'outLowPrice', 'number')}
            {renderField('最高收费标准：', 'outHighPrice', 'number')}
          </Box>
          <Box display="flex" gap={3}>
            {renderField('备注：', 'remark', 'textarea')}
            {renderField('描述：', 'description', 'textarea')}
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
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : undefined}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(FormDialog)
