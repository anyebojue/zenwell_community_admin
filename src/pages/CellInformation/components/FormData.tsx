import { memo } from 'react'
import { Box, FormControl, Button, MenuItem, Stack, TextField } from '@mui/material'
import { Add, Delete, History, Search } from '@mui/icons-material'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid',
      borderColor: 'primary.main'
    }
  }
}

const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const city = [{ value: '0', label: '北京' }]

const FormData = () => {
  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 3, mb: 1.5 }}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入小区ID"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
          />
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            size="small"
            label="请输入小区名称"
            type="text"
            variant="outlined"
            sx={textFieldStyles}
          />
        </FormControl>
        <Stack direction="row" spacing={1}>
          {['省', '市', '县'].map(label => (
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined" key={label}>
              <TextField
                select
                size="small"
                label={`请选择${label}`}
                type="text"
                variant="outlined"
                sx={textFieldStyles}
              >
                {city.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          ))}
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Search />}
            sx={buttonStyles('#2660ad', '#1d428a')}
          >
            查询
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<History />}
            sx={buttonStyles('darkgray', '#696969')}
          >
            重置
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} component="form" sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonStyles('#2660ad', '#1d428a')}
        >
          新增
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonStyles('#B22222', '#8B0000')}
        >
          批量删除
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(FormData)
