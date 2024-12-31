import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, FormLabel, Stack, TextField, Button, Typography } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { find, update } from 'modules/property/systemSettings'
import { SystemSettingsParams } from 'api/model/property/systemSettingsModel'

interface FormData {
  mchid: string
  apikey: string
  cert_pem: string
  key_pem: string
}

const InputField: React.FC<{
  label: string
  type: string
  id: keyof FormData
  value: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ label, type, id, value, required, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>{label}：</FormLabel>
    <TextField
      placeholder="必填，请输入"
      type={type}
      size="small"
      required={required}
      id={id}
      value={value}
      onChange={onChange}
      fullWidth
      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
    />
  </Box>
)

const ChangePasswordIndex: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.SystemSettingsSlice)
  const [settingValue, setSettingValue] = useState<SystemSettingsParams>({})
  const [formData, setFormData] = useState<FormData>({
    mchid: '',
    apikey: '',
    cert_pem: '',
    key_pem: ''
  })
  const [error, setError] = useState<string>('')

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true, describe: 'pay' }))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (list.length > 0) {
      try {
        const data = JSON.parse(list[0]?.values || '{}')
        setSettingValue(list[0])
        setFormData({
          mchid: data.mchid || '',
          apikey: data.apikey || '',
          cert_pem: data.cert_pem || '',
          key_pem: data.key_pem || ''
        })
      } catch {
        message.error('数据解析失败，请检查网络是否畅通')
      }
    }
  }, [list])

  const formFields: Array<{
    label: string
    type: string
    id: keyof FormData
    required: boolean
  }> = [
    {
      label: '微信支付商户号 MCHID',
      type: 'text',
      id: 'mchid',
      required: true
    },
    {
      label: '微信支付密钥 APIKEY',
      type: 'text',
      id: 'apikey',
      required: true
    },
    {
      label: 'apiclient_cert.pem',
      type: 'text',
      id: 'cert_pem',
      required: true
    },
    {
      label: 'apiclient_key.pem',
      type: 'text',
      id: 'key_pem',
      required: true
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }

  const validateForm = () => {
    const { mchid, apikey, cert_pem, key_pem } = formData
    return mchid && apikey && cert_pem && key_pem ? '' : '所有字段均为必填项'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMessage = validateForm()
    if (errorMessage) {
      setError(errorMessage)
      return
    }

    setError('')
    const closeLoading = message.loading('正在修改密码...')
    try {
      const params = { ...settingValue, values: JSON.stringify(formData) }
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      message.success('修改成功')
    } catch {
      message.error('修改失败，请检查网络是否畅通')
    } finally {
      closeLoading()
    }
  }

  return (
    <Box sx={{ mt: 2, maxWidth: 1100, padding: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ pb: 3 }}>
        微信支付设置
      </Typography>
      {error && (
        <Typography color="error" align="center" sx={{ pb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required }) => (
            <InputField
              key={id}
              label={label}
              type={type}
              id={id}
              value={formData[id]}
              required={required}
              onChange={handleInputChange}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="error"
            sx={{ width: '30%', ...buttonStyles('#2660ad', '#1d428a') }}
          >
            确认修改
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default memo(ChangePasswordIndex)
