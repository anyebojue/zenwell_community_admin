import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, FormControl, FormLabel, MenuItem, Stack } from '@mui/material'

interface FormDialogProps {
  open: boolean
  dialogType: string
  onClose: () => void
}

interface FormData {
  email: string
  name: string
  address: string
  phone: string
}

const city = [{ value: '0', label: '北京' }]

const FormDialog: React.FC<FormDialogProps> = ({ open, dialogType, onClose }) => {
  const [province, setProvince] = useState('')
  const [cityValue, setCityValue] = useState('')
  const [county, setCounty] = useState('')

  const handleSelectChange =
    (setter: Dispatch<SetStateAction<string>>) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
    }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson: Partial<FormData> = {}
    formData.forEach((value, key) => {
      formJson[key as keyof FormData] = value.toString()
    })
    const email = formJson.email
    console.log(email)
    onClose()
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>小区名称：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>小区地区：</FormLabel>
            {[
              { label: '省', value: province, setter: setProvince },
              { label: '市', value: cityValue, setter: setCityValue },
              { label: '县', value: county, setter: setCounty }
            ].map(({ label, value, setter }) => (
              <FormControl sx={{ width: '22%' }} variant="outlined" key={label}>
                <TextField
                  select
                  size="small"
                  label={`请选择${label}`}
                  value={value}
                  onChange={handleSelectChange(setter)}
                  variant="outlined"
                >
                  {city.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>小区地址：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>附近地标：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>客服电话：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>缴费周期：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>每月单价：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>社区编码：</FormLabel>
            <TextField sx={{ width: '80%' }} size="small" required id="name" />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          取消
        </Button>
        <Button variant="contained" type="submit">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
