import React, { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

interface LoadComponentProps {
  component: React.LazyExoticComponent<React.ComponentType<{}>>
}

const LoadComponent: React.FC<LoadComponentProps> = ({ component: Component }) => (
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
