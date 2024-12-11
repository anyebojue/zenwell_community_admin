import { memo } from 'react'
import { Box } from '@mui/material'
import FormSearch from './RelevanceTableFormSearch'
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
