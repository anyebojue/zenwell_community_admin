import { memo } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { Add } from '@mui/icons-material'
import { buttonStyles } from 'components/DeleteModal'

interface SearchFormProps {}

const FormSearch: React.FC<SearchFormProps> = () => {
  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1} component="form">
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => console.log(1111)}
        >
          商用流程
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormSearch)
