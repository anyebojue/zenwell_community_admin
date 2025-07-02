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
import { FeeFormulaParams, FeeFormulaReply } from 'api/model/property/feeConfig/feeFormulaModel'
import { create, find, update } from 'modules/property/feeConfig/feeFormula'
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
  Typography
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'

interface FormDialogProps {
  dialogValue?: FeeFormulaReply
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
  const { page } = useSelector((state: RootState) => state.FeeFormulaSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      formulaValue: dialogType === 'edit' ? dialogValue?.formulaValue || '' : '',
      price: dialogType === 'edit' ? dialogValue?.price || 0 : 0,
      formulaDesc: dialogType === 'edit' ? dialogValue?.formulaDesc || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<FeeFormulaParams>(initialFormData)

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>公式：</FormLabel>
            <TextField
              required
              placeholder="请输入公式"
              sx={{ width: '80%' }}
              type="text"
              multiline
              rows={4}
              size="small"
              value={formData.formulaValue}
              onChange={e => setFormData({ ...formData, formulaValue: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>单价：</FormLabel>
            <TextField
              required
              placeholder="请输入单价"
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>描述：</FormLabel>
            <TextField
              required
              placeholder="请输入描述"
              sx={{ width: '80%' }}
              type="text"
              multiline
              rows={4}
              size="small"
              value={formData.formulaDesc}
              onChange={e => setFormData({ ...formData, formulaDesc: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <FormLabel>说明：</FormLabel>
            <Typography sx={{ ml: 10, textAlign: 'left' }} variant="body1">
              T 代表总量，如电费总使用量 <br />
              C 代表房屋对应小区面积 <br />
              F 代表房屋对应楼栋面积 <br />
              U 代表房屋对应单元面积 <br />
              R 代表房屋面积 <br />
              X 代表房屋收费系数（房屋管理中配置） <br />
              L 代表房屋对应楼栋房屋数 <br />
              D 代表房屋对应单元房屋数 <br />
              举例：公共区域公摊电费 电量/楼栋面积*房屋面积 <br />
              公式：T/F * R
            </Typography>
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
