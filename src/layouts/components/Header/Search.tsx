import { memo } from 'react'
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'

const Search = () => {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="搜索..."
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRounded fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search'
        }}
      />
    </FormControl>
  )
}
export default memo(Search)
