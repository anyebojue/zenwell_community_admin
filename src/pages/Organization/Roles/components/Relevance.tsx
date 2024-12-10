import { Box } from '@mui/material'
import { memo } from 'react'
import FormSearch from './FormSearch'
import RelevanceTableData from './RelevanceTableData'

const Relevance = () => {
  return (
    <Box>
      <FormSearch />
      <RelevanceTableData />
    </Box>
  )
}

export default memo(Relevance)
