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
  ApplyRoomDiscountParams,
  ApplyRoomDiscountReply
} from 'api/model/property/feeConfig/applyRoomDiscountModel'
import { create, find, update } from 'modules/property/feeConfig/applyRoomDiscount'
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
  MenuItem,
  IconButton,
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { AddCircle } from '@mui/icons-material'
import { uploadImage } from 'api/info'

interface FormDialogProps {
  dialogValue?: ApplyRoomDiscountReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

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

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.ApplyRoomDiscountSlice)
  const { list } = useSelector((state: RootState) => state.ApplyRoomDiscountTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: feeDiscountList } = useSelector((state: RootState) => state.FeeDiscountSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      roomId: dialogType === 'add' ? '' : dialogValue?.roomId || '',
      roomName: dialogType === 'add' ? '' : dialogValue?.roomName || '',
      applyType: dialogType === 'add' ? '' : dialogValue?.applyType || '',
      feeId: dialogType === 'add' ? '' : dialogValue?.feeId || '',
      discountType: dialogType === 'add' ? '' : dialogValue?.discountType || '',
      discountId: dialogType === 'add' ? '' : dialogValue?.discountId || '',
      createUserName: dialogType === 'add' ? '' : dialogValue?.createUserName || '',
      createUserTel: dialogType === 'add' ? '' : dialogValue?.createUserTel || '',
      startTime:
        dialogType === 'add'
          ? formatDateTime(new Date())
          : dialogValue?.startTime || formatDateTime(new Date()),
      endTime:
        dialogType === 'add'
          ? formatDateTime(new Date())
          : dialogValue?.endTime || formatDateTime(new Date()),
      createRemark: dialogType === 'add' ? '' : dialogValue?.createRemark || '',
      img: dialogType === 'add' ? '' : dialogValue?.img || '',
      stateCd: dialogType === 'add' ? '' : dialogValue?.stateCd || '',
      checkRemark: dialogType === 'add' ? '' : dialogValue?.checkRemark || '',
      reviewRemark: dialogType === 'add' ? '' : dialogValue?.reviewRemark || '',
      returnWay: dialogType === 'add' ? '' : dialogValue?.returnWay || ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<ApplyRoomDiscountParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
        .then(imageUrl => {
          setFormData({ ...formData, img: imageUrl })
        })
        .catch(() => {
          message.error('图片上传失败')
        })
    }
  }

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
            ? create({ stateCd: '1', ...params })
            : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size, is_export: true }))
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
          {(dialogType === 'add' || dialogType === 'edit') && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>房屋(楼栋-单元-房屋)：</FormLabel>
                <TextField
                  disabled={dialogType === 'edit'}
                  placeholder="必填，请填写房屋(楼栋-单元-房屋)"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>申请类型：</FormLabel>
                <TextField
                  disabled={dialogType === 'edit'}
                  placeholder="请选择申请类型"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.applyType || ''}
                  onChange={e => setFormData({ ...formData, applyType: e.target.value })}
                  variant="outlined"
                >
                  {list.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>费用项目：</FormLabel>
                <TextField
                  disabled={dialogType === 'edit'}
                  placeholder="请选择费用项目"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.feeId || ''}
                  onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                  variant="outlined"
                >
                  {feeConfigList.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>申请人：</FormLabel>
                <TextField
                  disabled={dialogType === 'edit'}
                  placeholder="必填，请填写申请人"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={formData.createUserName}
                  onChange={e => setFormData({ ...formData, createUserName: e.target.value })}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>申请电话：</FormLabel>
                <TextField
                  disabled={dialogType === 'edit'}
                  placeholder="必填，请填写申请电话"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={formData.createUserTel}
                  onChange={e => setFormData({ ...formData, createUserTel: e.target.value })}
                  variant="outlined"
                />
              </Box>
            </>
          )}
          {dialogType === 'inspection' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>验房状态：</FormLabel>
              <TextField
                placeholder="请选择验房状态"
                sx={{ width: '80%' }}
                select
                size="small"
                value={formData.stateCd || ''}
                onChange={e => setFormData({ ...formData, stateCd: e.target.value })}
                variant="outlined"
              >
                {[
                  { value: '2', label: '验房通过' },
                  { value: '3', label: '验房不通过' }
                ].map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {dialogType === 'examine' && (
            <>
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
                  {[{ value: '3003', label: '优惠(需要申请)' }].map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>折扣名称：</FormLabel>
                <TextField
                  placeholder="请选择折扣名称"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.discountId || ''}
                  onChange={e => setFormData({ ...formData, discountId: e.target.value })}
                  variant="outlined"
                >
                  {feeDiscountList.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>返还方式：</FormLabel>
                <TextField
                  placeholder="请选择返还方式"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.returnWay || ''}
                  onChange={e => setFormData({ ...formData, returnWay: e.target.value })}
                  variant="outlined"
                >
                  {[
                    { value: '1001', label: '享受缴纳折扣' },
                    { value: '1002', label: '预缴金额返还至余额账户' }
                  ].map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>审批状态：</FormLabel>
                <TextField
                  placeholder="请选择审批状态"
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.stateCd || ''}
                  onChange={e => setFormData({ ...formData, stateCd: e.target.value })}
                  variant="outlined"
                >
                  {[
                    { value: '4', label: '审批通过' },
                    { value: '5', label: '审批不通过' }
                  ].map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>申请说明：</FormLabel>
            <TextField
              disabled={dialogType !== 'add'}
              placeholder="必填，请填写申请说明"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.createRemark}
              onChange={e => setFormData({ ...formData, createRemark: e.target.value })}
              variant="outlined"
            />
          </Box>
          {(dialogType === 'inspection' || dialogType === 'examine') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>验房说明：</FormLabel>
              <TextField
                disabled={dialogType === 'examine'}
                placeholder="必填，请填写验房说明"
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.checkRemark}
                onChange={e => setFormData({ ...formData, checkRemark: e.target.value })}
                variant="outlined"
              />
            </Box>
          )}
          {dialogType === 'examine' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>审批说明：</FormLabel>
              <TextField
                placeholder="必填，请填写审批备注"
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.reviewRemark}
                onChange={e => setFormData({ ...formData, reviewRemark: e.target.value })}
                variant="outlined"
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.startTime)}
              onChange={e =>
                setFormData({ ...formData, startTime: formatDateTime(e.target.value) })
              }
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束时间：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              size="small"
              type="datetime-local"
              value={formatDateTime(formData.endTime)}
              onChange={e => setFormData({ ...formData, endTime: formatDateTime(e.target.value) })}
              variant="outlined"
            />
          </Box>
          {dialogType !== 'edit' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>图片材料：</FormLabel>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #2660ad',
                  borderRadius: '8px',
                  width: '80%',
                  padding: '10px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <input
                  type="file"
                  style={{ display: 'none' }}
                  id="before-image-upload"
                  onChange={handleImageChange}
                />
                {formData.img ? (
                  <img src={formData.img} alt="发票" style={{ width: '200px' }} />
                ) : (
                  <>
                    <label
                      htmlFor="before-image-upload"
                      onClick={() => document.getElementById('before-image-upload')?.click()}
                    >
                      <IconButton sx={{ color: '#2660ad' }}>
                        <AddCircle />
                      </IconButton>
                    </label>
                    <Typography variant="body2" color="textSecondary">
                      点击上传图片材料
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}
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
