import { createRoot, Root } from 'react-dom/client'
import { CloseRounded, CheckCircle, Report, Warning, Info } from '@mui/icons-material'
import { Box, Alert, IconButton, Typography, CircularProgress } from '@mui/material'

interface MessageOptions {
  type: 'success' | 'warning' | 'error' | 'neutral' | 'loading'
  content: string
}

const iconMap = {
  success: <CheckCircle />,
  warning: <Warning />,
  error: <Report />,
  neutral: <Info />,
  loading: <CircularProgress size={24} />
}

const colorMap: Record<MessageOptions['type'], 'success' | 'error' | 'info' | 'warning'> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  neutral: 'info',
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
  neutral: (content: string) => createMessage({ type: 'neutral', content }),
  loading: (content: string) => createMessage({ type: 'loading', content })
}

export default message
