import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Login } from 'api/login'
import { LoginParams } from 'api/model/loginModel'
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
import message from 'components/Message'
import { getUserInfo } from 'modules/global'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(100px)',
  borderRadius: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    padding: theme.spacing(5),
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

const LoginIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginParams>()

  const onSubmit = async (data: LoginParams) => {
    const { username, password } = data
    const closeLoading = message.loading('正在登录中...')
    try {
      const res = await Login({ username, password })
      localStorage.setItem('zenwell_token', res.token)
      closeLoading()
      message.success('登录成功')
      navigate('/')
      dispatch(getUserInfo())
    } catch (err) {
      closeLoading()
      message.error('请检查用户名或密码是否正确')
    }
  }

  return (
    <SignInContainer direction="column" justifyContent="center">
      {/* 移动端 Logo */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center' }}>
        <img style={{ width: '40%' }} src={zenwellLogo} alt="Zenwell Logo" />
      </Box>
      <Card variant="outlined">
        {/* 桌面端左侧内容 */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <img style={{ width: '35%' }} src={zenwellLogo} alt="Zenwell Logo" />
            <Typography sx={{ fontSize: 'clamp(1.5rem, 10vw, 1rem)', pt: 3.5 }}>
              欢迎使用
            </Typography>
            <Typography sx={{ fontSize: 'clamp(1.3rem, 10vw, 1rem)' }}>
              Zenwell 智慧物业管理系统
            </Typography>
          </Box>
          <img style={{ width: '20%' }} src={zenwell} alt="Zenwell" />
        </Box>
        {/* 移动端内容 */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'column',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
            登录
          </Typography>
          <Typography sx={{ fontSize: '1.25rem', pt: 1, pb: 2 }}>
            Zenwell 智慧物业管理系统
          </Typography>
        </Box>
        {/* 表单部分 */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: { sm: '130%' }, gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="username" sx={{ fontWeight: 500 }}>
              用户名
            </FormLabel>
            <TextField
              defaultValue="super"
              {...register('username', { required: '请输入用户名' })}
              id="username"
              placeholder="请输入用户名"
              autoComplete="current-username"
              error={!!errors?.username}
              helperText={errors?.username?.message}
              fullWidth
              size="medium"
              sx={theme => ({
                '& .MuiOutlinedInput-root': {
                  marginTop: '5px',
                  height: '45px',
                  border: '2px solid',
                  borderColor: theme.palette.divider
                }
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password" sx={{ fontWeight: 500 }}>
              密码
            </FormLabel>
            <TextField
              defaultValue="zenwell123"
              {...register('password', { required: '请输入密码' })}
              id="password"
              type="password"
              placeholder="请输入密码"
              autoComplete="current-password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              fullWidth
              sx={theme => ({
                '& .MuiOutlinedInput-root': {
                  marginTop: '5px',
                  height: '45px',
                  border: '2px solid',
                  borderColor: theme.palette.divider
                }
              })}
            />
          </FormControl>
          <Button
            sx={{ mt: 2 }}
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? '登录中...' : '登录'}
          </Button>
        </Box>
      </Card>
      <Copyright />
    </SignInContainer>
  )
}

export default memo(LoginIndex)
