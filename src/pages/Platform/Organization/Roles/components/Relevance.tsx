import { memo } from 'react'
import { Box, Theme } from '@mui/material'
import FormSearch from './RelevanceTableFormSearch'
import RelevanceTableData from './RelevanceTableData'

const Relevance = () => {
  const contentBoxStyle = (theme: Theme) => ({
    background: theme.palette.background.default,
    borderRadius: '15px',
    padding: '15px 15px',
    width: '100%'
  })

  return (
    <Box sx={contentBoxStyle}>
      <FormSearch />
      <RelevanceTableData />
    </Box>
  )
}

export default memo(Relevance)
