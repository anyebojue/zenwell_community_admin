import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { create, find as timeFind } from 'modules/property/houses/spaceOpenTime'
import Grid from '@mui/material/Grid2'
import {
  Box,
  FormLabel,
  Button,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import message from 'components/Message'
import { SpaceReply } from 'api/model/property/houses/spaceModel'

interface FormDialogProps {
  dialogSpaceValue?: SpaceReply
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({ dialogSpaceValue, openDialog, setOpenDialog }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.SpaceOpenTimeSlice)
  const [formData, setFormData] = useState<Record<string, number>>({})

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(timeFind({ 'page.disable': true, spaceId: dialogSpaceValue?.id }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dialogSpaceValue?.id, dispatch])

  useEffect(() => {
    if (openDialog) {
      fetchData()
    }
  }, [openDialog, fetchData])

  useEffect(() => {
    const hoursData: Record<string, number> = {}
    for (let i = 0; i < 24; i++) {
      hoursData[`hours-${i}`] = 0
    }
    list.forEach(item => {
      const hour = item.hours
      if (hour !== undefined && hour >= 0 && hour < 24) {
        hoursData[`hours-${hour}`] = item.isOpen ?? 0
      }
    })
    setFormData(hoursData)
  }, [list])

  const handleFieldChange = async (hour: number, value: number) => {
    const closeLoading = message.loading('正在加载中，请稍后...')
    try {
      const current_community = localStorage.getItem('current_community')
      const community = JSON.parse(current_community || '')
      const params = {
        communityId: community.id,
        spaceId: dialogSpaceValue?.id,
        hours: hour,
        isOpen: value,
        status: 0
      }
      const action = create(params)
      const res = await dispatch(action)
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      setFormData(prevState => ({
        ...prevState,
        [`hours-${hour}`]: value
      }))
      message.success('保存成功')
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>设置开放时间</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Grid container spacing={{ xs: 1, md: 3 }}>
          {Array.from({ length: 24 }, (_, index) => (
            <Grid key={index} size={{ xs: 1, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                key={`hour-${index}`}
              >
                <FormLabel>{index}点</FormLabel>
                <TextField
                  sx={{ width: '120px' }}
                  select
                  size="small"
                  value={formData[`hours-${index}`] || 0}
                  onChange={e => handleFieldChange(index, Number(e.target.value))}
                  variant="outlined"
                >
                  <MenuItem value={1}>可预约</MenuItem>
                  <MenuItem value={0}>不可预约</MenuItem>
                </TextField>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenDialog(false)}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(FormDialog)
