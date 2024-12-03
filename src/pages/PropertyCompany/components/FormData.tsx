import { memo } from 'react'
import { Button, FormControl, Stack, TextField } from '@mui/material'
import { Search, History, Add, Delete } from '@mui/icons-material'

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

const FormData = () => {
  return (
    <Stack direction="row" spacing={3} component="form" sx={{ mt: 3, mb: 1.5 }}>
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          size="small"
          label="请输入物业编号"
          type="text"
          variant="outlined"
          sx={textFieldStyles}
        />
      </FormControl>
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          size="small"
          label="请输入名称"
          type="text"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none' // 默认没有边框
              },
              '&:hover fieldset': {
                border: '1px solid', // hover 时显示边框
                borderColor: 'primary.main' // 使用主题的主色
              },
              '&.Mui-focused fieldset': {
                border: '2px solid', // focus 时显示边框
                borderColor: 'primary.main' // 使用主题的主色
              }
            }
          }}
        />
      </FormControl>
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          size="small"
          label="请输入电话"
          type="number"
          variant="outlined"
          sx={textFieldStyles}
        />
      </FormControl>
      <Stack direction="row" spacing={1} component="form" sx={{ mt: 3, mb: 1.5 }}>
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
    </Stack>
  )
}

export default memo(FormData)
