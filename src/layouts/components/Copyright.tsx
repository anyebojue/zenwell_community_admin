import { memo } from 'react'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={[
        {
          color: 'text.secondary',
          marginTop: '20px'
        }
      ]}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://cq.zenwell.cn/">
        Zenwell
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default memo(Copyright)
