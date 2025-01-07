import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SystemSettingsParams } from 'api/model/property/systemSettingsModel'
import { find, update } from 'modules/property/systemSettings'
import { Box, Button, FormLabel, Stack, TextField, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import { RichTreeView } from '@mui/x-tree-view'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'

interface FormData {
  access_key: string
  access_secret: string
  sign_name: string
  template_code: string
  region_id: string
}

const InputField: React.FC<{
  label: string
  type: string
  id: keyof FormData
  value: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  text: string
}> = ({ label, type, id, value, required, onChange, text }) => (
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
      helperText={text}
      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
    />
  </Box>
)

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '20%'
})

const CellAllocationIndex: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.SystemSettingsSlice)
  const [settingValue, setSettingValue] = useState<SystemSettingsParams>({})
  const [selectedItem, setSelectedItem] = useState<string>('1')
  const [formData, setFormData] = useState<FormData>({
    access_key: '',
    access_secret: '',
    sign_name: '',
    template_code: '',
    region_id: ''
  })
  const [error, setError] = useState<string>('')

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true, describe: 'community' }))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
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
          access_key: data.access_key || '',
          access_secret: data.access_secret || '',
          sign_name: data.sign_name || '',
          template_code: data.template_code || '',
          region_id: data.region_id || ''
        })
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      }
    }
  }, [list])

  const formFields: Array<{
    label: string
    type: string
    id: keyof FormData
    required: boolean
    text: string
  }> = [
    {
      label: 'key',
      type: 'text',
      id: 'access_key',
      required: true,
      text: '说明：阿里云短信accessKeyId'
    },
    {
      label: '访问秘钥',
      type: 'text',
      id: 'access_secret',
      required: true,
      text: '说明：阿里云短信访问秘钥'
    },
    {
      label: '短信签名',
      type: 'text',
      id: 'sign_name',
      required: true,
      text: '说明：阿里云短信签名'
    },
    {
      label: '模板',
      type: 'text',
      id: 'template_code',
      required: true,
      text: '说明：阿里云短信模板'
    },
    {
      label: '区域',
      type: 'text',
      id: 'region_id',
      required: true,
      text: '说明：阿里云短信区域，如cn-hangzhou'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }

  const validateForm = () => {
    const { access_key, access_secret, sign_name, template_code, region_id } = formData
    return access_key && access_secret && sign_name && template_code && region_id
      ? ''
      : '所有字段均为必填项'
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
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <RichTreeView
            items={[{ id: '1', label: '阿里云短信' }]}
            selectedItems={selectedItem}
            onSelectedItemsChange={(_, itemId) => itemId && setSelectedItem(itemId)}
          />
        </Box>
        {error && (
          <Typography color="error" align="center" sx={{ pb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%', padding: '0 150px 0 70px' }}>
          <Stack spacing={3}>
            {formFields.map(({ label, type, id, required, text }) => (
              <InputField
                key={id}
                label={label}
                type={type}
                id={id}
                value={formData[id]}
                required={required}
                onChange={handleInputChange}
                text={text}
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
      </Stack>
      <Copyright />
    </Box>
  )
}

export default memo(CellAllocationIndex)
