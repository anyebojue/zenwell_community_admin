import { memo } from 'react'
import { FormControl, MenuItem, Stack, TextField } from '@mui/material'

const FormData = () => {
  const city = [{ value: '0', label: '北京' }]
  return (
    <Stack direction="row" spacing={3} component="form" sx={{ mt: 3, mb: 1.5 }}>
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          size="small"
          label="请输入小区ID"
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
          label="请输入小区名称"
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
      <Stack direction="row" spacing={1}>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择省"
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
          >
            {city.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择市"
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
          >
            {city.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
          <TextField
            select
            size="small"
            label="请选择县"
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
          >
            {city.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack>
    </Stack>
  )
}

export default memo(FormData)
