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
import { OwnerCarParams, OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { create, find, update } from 'modules/property/parking/ownerCar'
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
  selectedButton: string
  dialogValue?: OwnerCarReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  selectedButton,
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerCarTypeSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      name: dialogType === 'edit' ? dialogValue?.name || '' : '',
      feeTypeCd: dialogType === 'edit' ? dialogValue?.feeTypeCd || '' : '',
      feeFlag: dialogType === 'edit' ? dialogValue?.feeFlag || '' : '',
      paymentCycle: dialogType === 'edit' ? dialogValue?.paymentCycle || '' : '',
      paymentCd: dialogType === 'edit' ? dialogValue?.paymentCd || '1200' : '1200',
      prepaymentPeriod: dialogType === 'edit' ? dialogValue?.prepaymentPeriod || '1' : '1',
      units: dialogType === 'edit' ? dialogValue?.units || '元' : '元',
      deductFrom: dialogType === 'edit' ? dialogValue?.deductFrom || 'Y' : 'Y',
      payOnline: dialogType === 'edit' ? dialogValue?.payOnline || 'Y' : 'Y',
      scale: dialogType === 'edit' ? dialogValue?.scale || '1' : '1',
      decimalPlace: dialogType === 'edit' ? dialogValue?.decimalPlace || 2 : 2,
      status: dialogType === 'edit' ? dialogValue?.status || 1 : 1,
      computingFormula: dialogType === 'edit' ? dialogValue?.computingFormula || '' : '',
      squarePrice: dialogType === 'edit' ? dialogValue?.squarePrice || 0 : 0,
      additionalAmount: dialogType === 'edit' ? dialogValue?.additionalAmount || 0 : 0
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<OwnerCarParams>(initialFormData)

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
        const params = {
          ...formData,
          communityId: community?.id,
          startTime: new Date().toISOString().slice(0, 10),
          endTime: '2050-01-01'
        }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({
            'page.num': page.num || '1',
            'page.size': page.size,
            ...(selectedButton && { leaseType: selectedButton })
          })
        )
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
    [
      formData,
      dialogType,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      selectedButton,
      setOpenDialog,
      initialFormData
    ]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>收费项目：</FormLabel>
            <TextField
              required
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeTypeCd}
              onChange={e => setFormData({ ...formData, feeTypeCd: e.target.value })}
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
            <FormLabel>费用标识：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeFlag}
              onChange={e => setFormData({ ...formData, feeFlag: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1003006', label: '周期性费用' },
                { value: '2006012', label: '一次性费用' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {formData.feeFlag === '1003006' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>缴费周期(单位:月)：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.paymentCycle}
                onChange={e => setFormData({ ...formData, paymentCycle: e.target.value })}
                variant="outlined"
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>付费类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paymentCd}
              onChange={e => setFormData({ ...formData, paymentCd: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1200', label: '预付费' },
                { value: '2100', label: '后付费' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {formData.paymentCd === '1200' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>预付期(单位:天)：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.prepaymentPeriod}
                onChange={e => setFormData({ ...formData, prepaymentPeriod: e.target.value })}
                variant="outlined"
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>单位：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.units}
              onChange={e => setFormData({ ...formData, units: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>账户抵扣：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.deductFrom}
              onChange={e => setFormData({ ...formData, deductFrom: e.target.value })}
              variant="outlined"
            >
              {[
                { value: 'Y', label: '是' },
                { value: 'N', label: '否' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>手机缴费：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.payOnline}
              onChange={e => setFormData({ ...formData, payOnline: e.target.value })}
              variant="outlined"
            >
              {[
                { value: 'Y', label: '是' },
                { value: 'N', label: '否' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>进位方式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.scale}
              onChange={e => setFormData({ ...formData, scale: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1', label: '四舍五入' },
                { value: '3', label: '向上进位' },
                { value: '4', label: '向下进位' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>保留小数位：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.decimalPlace}
              onChange={e => setFormData({ ...formData, decimalPlace: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '取整' },
                { value: 1, label: '1位' },
                { value: 2, label: '2位' },
                { value: 3, label: '3位' },
                { value: 4, label: '4位' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>状态：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 1, label: '启用' },
                { value: 0, label: '停用' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>计算公式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.computingFormula}
              onChange={e => setFormData({ ...formData, computingFormula: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1001', label: '建筑面积*单价+附加费' },
                { value: '2002', label: '固定费用' },
                { value: '4004', label: '动态费用' },
                { value: '5005', label: '(本期度数-上期度数)*单价+附加费' },
                { value: '6006', label: '用量*单价+附加费' },
                { value: '7007', label: '自定义公式' },
                { value: '9009', label: '(本期度数-上期度数)*动态单价+附加费' },
                { value: '1101', label: '租金' },
                { value: '3003', label: '室内面积*单价+附加费' },
                { value: '1102', label: '租金(递增)' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {(formData.computingFormula === '1001' ||
            formData.computingFormula === '5005' ||
            formData.computingFormula === '6006' ||
            formData.computingFormula === '3003') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>计费单价：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.squarePrice}
                onChange={e => setFormData({ ...formData, squarePrice: Number(e.target.value) })}
                variant="outlined"
              />
            </Box>
          )}
          {formData.computingFormula === '1001' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>附加费用：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.additionalAmount}
                onChange={e =>
                  setFormData({ ...formData, additionalAmount: Number(e.target.value) })
                }
                variant="outlined"
              />
            </Box>
          )}
          {(formData.computingFormula === '2002' ||
            formData.computingFormula === '5005' ||
            formData.computingFormula === '6006' ||
            formData.computingFormula === '3003') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>固定费用：</FormLabel>
              <TextField
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.additionalAmount}
                onChange={e =>
                  setFormData({ ...formData, additionalAmount: Number(e.target.value) })
                }
                variant="outlined"
              />
            </Box>
          )}
          {formData.computingFormula === '7007' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>自定义公式：</FormLabel>
              <TextField
                placeholder="请输入自定义公式"
                sx={{ width: '80%' }}
                type="text"
                multiline
                rows={4}
                size="small"
                value={formData.computingFormulaText}
                onChange={e => setFormData({ ...formData, computingFormulaText: e.target.value })}
                variant="outlined"
                helperText="说明：C 代表房屋对应小区面积；F 代表房屋对应楼栋面积；U 代表房屋对应单元面积；R 代表房屋面积；X 代表房屋收费系数（房屋管理中配置）；L 代表房屋层数；举例：电梯使用费 (层数-5)*每层单价+基础费用；公式：(L-5)*5 + 10；"
              />
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
