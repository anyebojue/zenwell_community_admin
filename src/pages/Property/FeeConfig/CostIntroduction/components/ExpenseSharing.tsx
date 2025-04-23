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
import { FeeConfigParams } from 'api/model/property/feeConfig/feeConfigModel'
import { create, find } from 'modules/property/feeConfig/feeConfig'
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
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const { list: housingManagementList } = useSelector((state: RootState) => state.FloorSlice)
  const { list: unitList } = useSelector((state: RootState) => state.UnitSlice)
  const { list: feeFormulaList } = useSelector((state: RootState) => state.FeeFormulaSlice)
  console.log(feeFormulaList)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)

  const initialFormData = useMemo(
    () => ({
      name: '',
      feeTypeCd: '',
      feeFlag: '',
      paymentCycle: '',
      paymentCd: '',
      prepaymentPeriod: '',
      units: '',
      deductFrom: '',
      payOnline: 'Y',
      scale: '1',
      decimalPlace: 2,
      status: 1,
      computingFormula: '',
      squarePrice: 0,
      additionalAmount: 0
    }),
    []
  )
  const [formData, setFormData] = useState<FeeConfigParams>(initialFormData)

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
        const action = create(params)
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success('创建成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [formData, dispatch, page.num, page.size, setOpenDialog, initialFormData]
  )

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>费用公摊</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用名称：</FormLabel>
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
              {list
                .filter(item => item.name === '公摊费')
                .map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeFlag}
              onChange={e => setFormData({ ...formData, feeFlag: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1010301', label: '普通房屋' },
                { value: '2020602', label: '商铺' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>使用量：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              type="text"
              size="small"
              value={formData.paymentCycle}
              onChange={e => setFormData({ ...formData, paymentCycle: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>公摊范围：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paymentCd}
              onChange={e => setFormData({ ...formData, paymentCd: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '1001', label: '当前小区' },
                { value: '2002', label: '楼栋' },
                { value: '3003', label: '单元' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>楼栋：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paymentCd}
              onChange={e => setFormData({ ...formData, paymentCd: e.target.value })}
              variant="outlined"
            >
              {housingManagementList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.floorNum}栋
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>单元：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.paymentCd}
              onChange={e => setFormData({ ...formData, paymentCd: e.target.value })}
              variant="outlined"
            >
              {unitList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.unitNum}单元
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>楼层：</FormLabel>
            <TextField
              disabled={disabled}
              sx={{ width: '56%' }}
              size="small"
              value={formData.paymentCd}
              onChange={e => setFormData({ ...formData, paymentCd: e.target.value })}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="error"
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setDisabled(!disabled)}
            >
              {disabled ? '自定义' : '全部'}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>房屋状态：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.deductFrom}
              onChange={e => setFormData({ ...formData, deductFrom: e.target.value })}
              variant="outlined"
            >
              {[
                { value: '2001', label: '已入住' },
                { value: '2003', label: '已交房' },
                { value: '2005', label: '已装修' },
                { value: '2004', label: '未入住' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>公摊公式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.computingFormula}
              onChange={e => setFormData({ ...formData, computingFormula: e.target.value })}
              variant="outlined"
            >
              {feeFormulaList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.formulaValue}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>备注：</FormLabel>
            <TextField
              placeholder="请输入"
              sx={{ width: '80%' }}
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
