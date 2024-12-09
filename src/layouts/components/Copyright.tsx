import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={[
        {
          color: 'text.secondary'
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
