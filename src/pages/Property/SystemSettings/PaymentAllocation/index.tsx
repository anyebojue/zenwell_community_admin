import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChangePassword } from 'api/info'
import { Box, FormLabel, Stack, TextField, Button, Typography } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'

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
  autocomplete: string
}> = ({ label, type, id, value, required, onChange, autocomplete }) => (
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
      autoComplete={autocomplete}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 1
        }
      }}
    />
  </Box>
)

const ChangePasswordIndex: React.FC = () => {
  const navigate = useNavigate()
  const info = useSelector((state: RootState) => state.info.userInfo)
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string>('')

  const formFields: {
    label: string
    type: string
    id: keyof FormData
    required: boolean
    autocomplete: string
  }[] = [
    {
      label: '原始密码',
      type: 'password',
      id: 'oldPassword',
      required: true,
      autocomplete: 'current-password'
    },
    {
      label: '新密码',
      type: 'password',
      id: 'newPassword',
      required: true,
      autocomplete: 'new-password'
    },
    {
      label: '确认密码',
      type: 'password',
      id: 'confirmPassword',
      required: true,
      autocomplete: 'new-password'
    }
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
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ display: 'none' }}
          autoFocus
          required
          margin="dense"
          id="username"
          name="username"
          label="密码"
          type="text"
          fullWidth
          variant="standard"
          autoComplete="new-username"
          value={info.username}
        />
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required, autocomplete }) => (
            <InputField
              key={id}
              label={label}
              type={type}
              id={id}
              value={formData[id]}
              required={required}
              onChange={handleInputChange}
              autocomplete={autocomplete}
            />
          ))}
        </Stack>
        <Button
          type="submit"
          size="small"
          variant="contained"
          color="error"
          sx={{
            width: '100%',
            mt: 5,
            ...buttonStyles('#2660ad', '#1d428a')
          }}
        >
          确认修改
        </Button>
      </form>
    </Box>
  )
}

export default memo(ChangePasswordIndex)
