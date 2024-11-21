import React, { useState } from 'react'
import {
  styled,
  Box,
  Button,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack
} from '@mui/material'
import MuiCard from '@mui/material/Card'
import zenwellLogo from 'assets/global/zenwell-logo.png'
import zenwell from 'assets/global/zenwell.png'
import Copyright from 'layouts/components/Copyright'

// 封装的样式组件
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(100px)',
  WebkitBackdropFilter: 'blur(100px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: theme.spacing(3),
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
    flexDirection: 'row',
    maxWidth: '800px',
    minHeight: '350px'
  },
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)'
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(5),
  position: 'relative',
  backgroundImage: 'radial-gradient(circle, #eff8fe 0%, white 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: -1
  }
}))

const Login = () => {
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  })

  const validateInputs = (username: string, password: string) => {
    const errors: typeof formErrors = { username: '', password: '' }
    if (!username || !/\S+@\S+\.\S+/.test(username)) {
      errors.username = '请输入有效的用户名'
    }
    if (!password || password.length < 6) {
      errors.password = '密码至少6位'
    }
    setFormErrors(errors)
    return !errors.username && !errors.password
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get('username') as string
    const password = data.get('password') as string

    if (validateInputs(username, password)) {
      console.log({ username, password })
    }
  }

  return (
    <SignInContainer direction="column" justifyContent="center">
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <img style={{ width: '40%' }} src={zenwellLogo} alt="Zenwell Logo" />
      </Box>
      <Card variant="outlined">
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' }
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <img style={{ width: '30%' }} src={zenwellLogo} alt="Zenwell Logo" />
            <Typography variant="h6" sx={{ fontSize: 'clamp(2rem, 10vw, 1rem)', pt: 3 }}>
              登录
            </Typography>
            <Typography sx={{ fontSize: 'clamp(1.3rem, 10vw, 1rem)' }}>
              Zenwell 智慧物业管理系统
            </Typography>
          </Box>
          <img style={{ width: '20%' }} src={zenwell} alt="Zenwell" />
        </Box>
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' }
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontSize: 'clamp(1.5rem, 10vw, 1.5rem)' }}>
              登录
            </Typography>
            <Typography sx={{ fontSize: 'clamp(1.25rem, 10vw, 1.25rem)', pt: 3, pb: 2 }}>
              Zenwell 智慧物业管理系统
            </Typography>
          </Box>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: { sm: '130%' }, gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="username">用户名</FormLabel>
            <TextField
              id="username"
              name="username"
              placeholder="请输入用户名"
              autoComplete="username"
              error={!!formErrors.username}
              helperText={formErrors.username}
              fullWidth
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">密码</FormLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              autoComplete="current-password"
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
            />
          </FormControl>
          <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained">
            登录
          </Button>
        </Box>
      </Card>
      <Copyright />
    </SignInContainer>
  )
}

export default Login
