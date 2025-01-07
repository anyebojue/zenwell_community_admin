import React, { memo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { OwnerReply } from 'api/model/property/ownerModel'
import { Box, FormLabel, Stack, TextField, Button, Typography } from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { useDispatch } from 'react-redux'
import { update } from 'modules/property/room'
import Associated from './components/Associated'

interface FormData {
  roomId: string
  userId: string | undefined
  startTime: string
  endTime: string
}

const CheckIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state?.value
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [ownerUser, setOwnerUser] = useState<OwnerReply>()
  const [formData, setFormData] = useState<FormData>({
    roomId: `${data.unit?.floor?.name}-${data.unit?.unitNum}-${data.roomNum}`,
    userId: ownerUser?.name,
    startTime: new Date().toISOString().split('T')[0],
    endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 25))
      .toISOString()
      .split('T')[0]
  })
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (ownerUser?.id) {
      setFormData(prevData => ({
        ...prevData,
        userId: ownerUser.name
      }))
    }
  }, [ownerUser])

  const formFields: Array<{
    label: string
    type: string
    id: keyof FormData
    required: boolean
    disabled: boolean
  }> = [
    {
      label: '房屋',
      type: 'text',
      id: 'roomId',
      required: true,
      disabled: true
    },
    {
      label: '业主',
      type: 'text',
      id: 'userId',
      required: true,
      disabled: true
    },
    {
      label: '开始时间',
      type: 'date',
      id: 'startTime',
      required: true,
      disabled: false
    },
    {
      label: '结束时间',
      type: 'date',
      id: 'endTime',
      required: true,
      disabled: false
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }

  const validateForm = () => {
    const { roomId, userId, startTime, endTime } = formData
    return roomId && userId && startTime && endTime ? '' : '所有字段均为必填项'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMessage = validateForm()
    if (errorMessage) {
      setError(errorMessage)
      return
    }
    setError('')
    const closeLoading = message.loading('正在修改密码...')
    const params = {
      userId: ownerUser?.id,
      state: '2003',
      id: data?.id,
      startTime: formData.startTime,
      endTime: formData.endTime
    }
    try {
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      navigate(-1)
      message.success('入住成功')
    } catch {
      message.error('入住失败，请检查网络是否畅通')
    } finally {
      closeLoading()
    }
  }

  return (
    <Box sx={{ mt: 2, maxWidth: 1100, padding: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ pb: 3 }}>
        房屋交房
      </Typography>
      {error && (
        <Typography color="error" align="center" sx={{ pb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required, disabled }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} key={id}>
              <FormLabel sx={{ fontWeight: 'bold', width: '20%' }}>{label}：</FormLabel>
              <TextField
                placeholder="必填，请输入"
                type={type}
                size="small"
                required={required}
                disabled={disabled}
                id={id}
                value={formData[id]}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': { borderRadius: 1 },
                  width: id === 'userId' ? '88%' : '100%'
                }}
              />
              {id === 'userId' && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={{ width: '10%', ml: 2, ...buttonStyles('#2660ad', '#1d428a') }}
                  onClick={() => setAssociatedOpen(true)}
                >
                  选择业主
                </Button>
              )}
            </Box>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Button
            type="button"
            size="small"
            variant="contained"
            color="error"
            sx={{ width: '20%' }}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="error"
            sx={{ width: '20%', ml: 2, ...buttonStyles('#2660ad', '#1d428a') }}
          >
            确认修改
          </Button>
        </Box>
      </form>
      <Associated
        setOwnerUser={setOwnerUser}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </Box>
  )
}

export default memo(CheckIn)
