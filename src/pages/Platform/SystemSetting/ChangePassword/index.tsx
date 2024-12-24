import React, { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChangePassword } from 'api/info'
import { Box, FormLabel, Stack, TextField, Button, Typography } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { useSelector } from 'react-redux'

interface FormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const InputField: React.FC<{
  label: string
  type: string
  id: keyof FormData
  value: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ label, type, id, value, required, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 1
        }
      }}
    />
  </Box>
)

const FormDialog: React.FC = () => {
  const navigate = useNavigate()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string>('')

  const formFields: { label: string; type: string; id: keyof FormData; required: boolean }[] = [
    { label: '原始密码', type: 'password', id: 'oldPassword', required: true },
    { label: '新密码', type: 'password', id: 'newPassword', required: true },
    { label: '确认密码', type: 'password', id: 'confirmPassword', required: true }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = formData
    if (!oldPassword || !newPassword || !confirmPassword) {
      return '所有字段均为必填项'
    }
    if (newPassword !== confirmPassword) {
      return '新密码与确认密码不一致'
    }
    return ''
  }

  const handleSubmit = async () => {
    const errorMessage = validateForm()
    if (errorMessage) {
      setError(errorMessage)
      return
    }

    setError('')
    const closeLoading = message.loading('正在修改密码...')
    try {
      await ChangePassword({
        username: info.username,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
      closeLoading()
      message.success('修改成功')
      navigate('/login')
    } catch {
      closeLoading()
      message.error('修改密码失败，请检查用户名或密码')
    }
  }

  return (
    <Box sx={{ mt: 2, mx: 'auto', maxWidth: 600, padding: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ pb: 3 }}>
        修改密码
      </Typography>
      {error && (
        <Typography color="error" align="center" sx={{ pb: 2 }}>
          {error}
        </Typography>
      )}
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
      <Button
        size="small"
        variant="contained"
        color="error"
        sx={{
          width: '100%',
          mt: 5,
          ...buttonStyles('#2660ad', '#1d428a')
        }}
        onClick={handleSubmit}
      >
        确认修改
      </Button>
    </Box>
  )
}

export default memo(FormDialog)
