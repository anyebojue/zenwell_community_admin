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
import { MeterWaterParams, MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'
import { create, find, update } from 'modules/property/feeConfig/meterWater'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
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
import { RoomReply } from 'api/model/property/houses/roomModel'

interface FormDialogProps {
  dialogValue?: { id?: string; label?: string; roomData?: RoomReply }
  dialogMeterWaterValue: MeterWaterReply
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
  dialogMeterWaterValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.MeterTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const [loading, setLoading] = useState(false)

  const initialFormData = useMemo(
    () => ({
      preDegrees: dialogType === 'edit' ? dialogMeterWaterValue?.preDegrees || 0 : 0,
      curDegrees: dialogType === 'edit' ? dialogMeterWaterValue?.curDegrees || 0 : 0,
      preReadingTime: dialogType === 'edit' ? dialogMeterWaterValue?.preReadingTime || '' : '',
      curReadingTime: dialogType === 'edit' ? dialogMeterWaterValue?.curReadingTime || '' : '',
      remark: dialogType === 'edit' ? dialogMeterWaterValue?.remark || '' : ''
    }),
    [dialogType, dialogMeterWaterValue]
  )
  const [formData, setFormData] = useState<MeterWaterParams>(initialFormData)

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
    setFormData(initialFormData)
    if (dialogType === 'code') {
      fetchData(
        findFeeConfig,
        { 'page.disable': true, feeTypeCd: formData.feeId || '' },
        '正在加载列表中，请稍后...'
      )
      fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [dialogType, fetchData, formData.feeId, initialFormData])

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
      <DialogTitle>
        {dialogType === 'add'
          ? '添加抄表'
          : dialogType === 'edit'
            ? '修改抄表'
            : dialogType === 'code'
              ? '抄表二维码'
              : '抄表导入'}
      </DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {dialogType === 'code' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>费用类型：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.feeId}
                  onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                  variant="outlined"
                >
                  {feeConfigTypeList.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>收费项目：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.objName}
                  onChange={e => setFormData({ ...formData, objName: e.target.value })}
                  variant="outlined"
                >
                  {feeConfigList.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </>
          )}
          {(dialogType === 'add' || dialogType === 'code') && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>抄表类型：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  select
                  size="small"
                  value={formData.meterType}
                  onChange={e => setFormData({ ...formData, meterType: e.target.value })}
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
                <FormLabel>收费对象：</FormLabel>
                <TextField
                  disabled
                  required
                  placeholder="请输入收费对象"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={`${dialogValue?.roomData?.roomNum} - ${dialogValue?.roomData?.unit?.unitNum} - ${dialogValue?.roomData?.unit?.floor?.floorNum}`}
                  variant="outlined"
                />
              </Box>
            </>
          )}
          {(dialogType === 'add' || dialogType === 'edit') && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>上期度数：</FormLabel>
                <TextField
                  required
                  placeholder="请输入上期度数"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={formData.preDegrees}
                  onChange={e => setFormData({ ...formData, preDegrees: Number(e.target.value) })}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>上期度数：</FormLabel>
                <TextField
                  required
                  placeholder="请输入上期度数"
                  sx={{ width: '80%' }}
                  type="text"
                  size="small"
                  value={formData.curDegrees}
                  onChange={e => setFormData({ ...formData, curDegrees: Number(e.target.value) })}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>上期读表时间：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  size="small"
                  type="datetime-local"
                  value={formatDateTime(formData.preReadingTime)}
                  onChange={e =>
                    setFormData({ ...formData, preReadingTime: formatDateTime(e.target.value) })
                  }
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>本期读表时间：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  size="small"
                  type="datetime-local"
                  value={formatDateTime(formData.curReadingTime)}
                  onChange={e =>
                    setFormData({ ...formData, curReadingTime: formatDateTime(e.target.value) })
                  }
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>备注：</FormLabel>
                <TextField
                  required
                  placeholder="请输入描述"
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
            </>
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
