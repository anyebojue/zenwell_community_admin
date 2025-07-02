import { createRoot, Root } from 'react-dom/client'
import { CloseRounded, CheckCircle, Report, Warning, Info } from '@mui/icons-material'
import { Box, Alert, IconButton, Typography, CircularProgress } from '@mui/material'

interface MessageOptions {
  type: 'success' | 'warning' | 'error' | 'info' | 'loading'
  content: string
}

const iconMap = {
  success: <CheckCircle />,
  warning: <Warning />,
  error: <Report />,
  info: <Info />,
  loading: <CircularProgress size={24} />
}

const colorMap: Record<MessageOptions['type'], 'success' | 'error' | 'info' | 'warning'> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  loading: 'info'
}

const createMessage = ({ type, content }: MessageOptions) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  let root: Root | null = createRoot(div)

  const removeMessage = () => {
    if (root) {
      root.unmount()
      root = null
    }
    div.remove()
  }

  const element = (
    <>
      {type === 'loading' && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          width: 'fit-content',
          maxWidth: '90%'
        }}
      >
        <Alert
          sx={{ alignItems: 'flex-start', marginBottom: '16px' }}
          icon={iconMap[type]}
          severity={colorMap[type]}
          action={
            type !== 'loading' && (
              <IconButton color="inherit" size="small" onClick={removeMessage}>
                <CloseRounded />
              </IconButton>
            )
          }
        >
          <Typography variant="body2" color="inherit">
            {content}
          </Typography>
        </Alert>
      </Box>
    </>
  )

  if (root) {
    root.render(element)
  }

  if (type !== 'loading') {
    setTimeout(removeMessage, 3000)
  }

  return removeMessage
}

const message = {
  success: (content: string) => createMessage({ type: 'success', content }),
  error: (content: string) => createMessage({ type: 'error', content }),
  warning: (content: string) => createMessage({ type: 'warning', content }),
  info: (content: string) => createMessage({ type: 'info', content }),
  loading: (content: string) => {
    let timeoutId: NodeJS.Timeout | null = null
    let started = false
    let closeLoading: (() => void) | null = null

    // 延时显示loading，2000ms后才显示
    const delayTimeout = setTimeout(() => {
      if (!started) {
        started = true
        closeLoading = createMessage({ type: 'loading', content })
      }
    }, 2000)

    // 返回关闭函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId) // 清除延迟显示
      }
      clearTimeout(delayTimeout) // 清除2000ms的延迟

      if (closeLoading) {
        closeLoading() // 如果加载完成，关闭loading
      }
    }
  }
}

export default message
