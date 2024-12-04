import { ChangeEvent, Dispatch, memo, SetStateAction, useState } from 'react'
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
  const [province, setProvince] = useState('')
  const [cityValue, setCityValue] = useState('')
  const [county, setCounty] = useState('')

  const handleSelectChange =
    (setter: Dispatch<SetStateAction<string>>) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
    }

  return (
    <Box>
      <Stack direction="row" spacing={3} component="form" sx={{ mt: 2, mb: 1.5 }}>
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
          {[
            { label: '省', value: province, setter: setProvince },
            { label: '市', value: cityValue, setter: setCityValue },
            { label: '县', value: county, setter: setCounty }
          ].map(({ label, value, setter }) => (
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined" key={label}>
              <TextField
                select
                size="small"
                label={`请选择${label}`}
                value={value}
                onChange={handleSelectChange(setter)}
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
