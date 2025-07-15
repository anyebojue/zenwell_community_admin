import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  memo,
  useEffect,
  useMemo
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayFeeParams } from 'api/model/property/feeConfig/payFeeModel'
import { find, create } from 'modules/property/feeConfig/meterWater'
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
  Link
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { RoomReply } from 'api/model/property/houses/roomModel'
import { find as findFeeConfig } from 'modules/property/feeConfig/feeConfig'
import { find as findFeeConfigType } from 'modules/property/feeConfig/feeConfigType'
import { MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'

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

interface FormMeterReadingProps {
  dialogValue: { id?: string; label?: string; roomData?: RoomReply }
  dialogMeterWaterValue: MeterWaterReply
  openDialog: boolean
  dialogType: string
  setDialogType: Dispatch<SetStateAction<string>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormMeterReading: React.FC<FormMeterReadingProps> = ({
  dialogValue,
  dialogMeterWaterValue,
  openDialog,
  dialogType,
  setDialogType,
  setOpenDialog
}) => {
  console.log('dialogValue', dialogValue)
  console.log('dialogMeterWaterValue', dialogMeterWaterValue)
  const info = useSelector((state: RootState) => state.info.userInfo)
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.MeterWaterSlice)
  const { list } = useSelector((state: RootState) => state.MeterTypeSlice)
  const { list: feeConfigList } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: feeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const initialFormData = useMemo(
    () => ({
      feeId: dialogType === 'edit' ? dialogMeterWaterValue?.feeId || '' : '',
      feeTypeCd: dialogType === 'edit' ? dialogMeterWaterValue?.feeTypeCd || '' : '',
      configId: dialogType === 'edit' ? dialogMeterWaterValue?.configId || '' : '',
      objName: `${dialogValue?.roomData?.roomNum} - ${dialogValue?.roomData?.unit?.unitNum} - ${dialogValue?.roomData?.unit?.floor?.floorNum}`,
      meterType: dialogType === 'edit' ? dialogMeterWaterValue?.meterType || '' : '',
      preDegrees: dialogType === 'edit' ? dialogMeterWaterValue?.preDegrees || '' : '',
      curDegrees: dialogType === 'edit' ? dialogMeterWaterValue?.curDegrees || '' : '',
      preReadingTime: formatDateTime(new Date()),
      curReadingTime: formatDateTime(new Date())
    }),
    [dialogMeterWaterValue, dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<PayFeeParams>(initialFormData)

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
    if (openDialog) {
      fetchData(findFeeConfig, { 'page.disable': true }, '正在加载列表中，请稍后...')
      fetchData(findFeeConfigType, { 'page.disable': true }, '正在加载列表中，请稍后...')
    }
  }, [
    dialogValue.roomData?.roomNum,
    dialogValue.roomData?.unit?.floor?.floorNum,
    dialogValue.roomData?.unit?.unitNum,
    fetchData,
    initialFormData,
    openDialog,
    page.num,
    page.size
  ])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = { ...formData, communityId: community?.id, objId: dialogValue?.roomData?.id }
        const action = create({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            objId: dialogValue.roomData?.id || ''
          })
        )
        message.success('创建成功')
        setOpenDialog(false)
      } catch (err: unknown) {
        message.error(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    },
    [dispatch, dialogValue, formData, page, setOpenDialog]
  )

  const formFields = [
    { label: '上期度数', id: 'preDegrees' },
    { label: '本期度数', id: 'curDegrees' },
    { label: '备注', id: 'remark' }
  ]

  const handleFormDataChange = (id: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev }
      if (id.startsWith('meterWater.')) {
        const meterKey = id.split('.')[1] as keyof typeof prev.meterWater
        newFormData.meterWater = {
          ...prev.meterWater,
          [meterKey]: value
        }
      } else {
        ;(newFormData as unknown as Record<keyof PayFeeParams, string>)[id as keyof PayFeeParams] =
          value
      }
      return newFormData
    })
  }

  const handleWaterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      message.warning('请选择文件进行上传')
      return
    }
    const current_community = localStorage.getItem('current_community')
    const community = JSON.parse(current_community || '')
    const formValue = new FormData()
    formValue.append('file', file)
    formValue.append('communityId', community?.id)
    formValue.append('userId', info.id)
    setLoading(true)
    try {
      // await ImportRoom(formValue)
      message.success('文件上传成功')
      setFile(null)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
        setDialogType('')
      }}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: dialogType === 'add' ? handleSubmit : handleWaterSubmit
        }
      }}
    >
      <DialogTitle>
        {dialogType === 'add'
          ? '抄表'
          : dialogType === 'edit'
            ? '修改抄表'
            : dialogType === 'code'
              ? '二维码抄表'
              : dialogType === 'one'
                ? '抄表导入1'
                : '抄表导入2'}
      </DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>费用类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.feeTypeCd}
              onChange={e => handleFormDataChange('feeTypeCd', e.target.value)}
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
              value={formData.configId}
              onChange={e => handleFormDataChange('configId', e.target.value)}
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
            <FormLabel>抄表类型：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.meterType}
              onChange={e => handleFormDataChange('meterType', e.target.value)}
              variant="outlined"
            >
              {list.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {(dialogType === 'add' || dialogType === 'code') && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormLabel>收费对象：</FormLabel>
              <TextField
                disabled
                sx={{ width: '80%' }}
                type="text"
                size="small"
                value={formData.objName}
                onChange={e => setFormData({ ...formData, objName: e.target.value })}
                required
              />
            </Box>
          )}
          {(dialogType === 'one' || dialogType === 'two') && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>选择文件</FormLabel>
                <TextField
                  type="file"
                  sx={{ width: '80%' }}
                  size="small"
                  required
                  onChange={handleFileChange}
                  slotProps={{
                    htmlInput: {
                      accept: '.xlsx,.xls' // 限制只能选择Excel文件
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>下载模板</Box>
                <Box sx={{ ml: 6.5 }}>
                  请先下载
                  <Link
                    href="https://community-admin.zenwell.cn/files/pvdata/2025-01-07/c622b98ccb8fc29a15a91d3177d6c6b3/importRoom.xlsx"
                    download
                    sx={{ color: 'blue' }}
                  >
                    导入模板
                  </Link>
                  准备数据后，上传导入
                </Box>
              </Box>
            </>
          )}
          {(dialogType === 'add' || dialogType === 'edit') && (
            <>
              {formFields.map(({ label, id }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  key={id}
                >
                  <FormLabel>{label}：</FormLabel>
                  <TextField
                    type="text"
                    sx={{ width: '80%' }}
                    size="small"
                    id={id}
                    value={formData[id as keyof PayFeeParams]}
                    onChange={e => handleFormDataChange(id, e.target.value)}
                    required
                  />
                </Box>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormLabel>上期读表时间：</FormLabel>
                <TextField
                  sx={{ width: '80%' }}
                  size="small"
                  type="datetime-local"
                  value={formatDateTime(formData.meterWater?.preReadingTime)}
                  onChange={e =>
                    handleFormDataChange(
                      'meterWater.preReadingTime',
                      formatDateTime(e.target.value)
                    )
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
                  value={formatDateTime(formData.meterWater?.curReadingTime)}
                  onChange={e =>
                    handleFormDataChange(
                      'meterWater.curReadingTime',
                      formatDateTime(e.target.value)
                    )
                  }
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
        {dialogType === 'add' && (
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
        )}
        {(dialogType === 'one' || dialogType === 'two') && (
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
          >
            {loading ? '导入中...' : '导入'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default memo(FormMeterReading)
