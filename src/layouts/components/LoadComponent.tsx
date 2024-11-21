import React, { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

const LoadComponent = (Component: React.LazyExoticComponent<React.FC>): React.ReactElement => (
  <Suspense
    fallback={
      <Box className="full-center">
        <CircularProgress />
      </Box>
    }
  >
    <Component />
  </Suspense>
)

export default LoadComponent
