import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Theme,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { buttonStyles } from 'components/DeleteModal'
import { Close, WarningRounded } from '@mui/icons-material'
import message from 'components/Message'
import { get } from 'modules/property/owner'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { update } from 'modules/property/room'

const contentBoxStyle = (theme: Theme) => ({
  mt: 2.5,
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const CheckOut: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state?.value
  const { owner } = useSelector((state: RootState) => state.OwnerSlice)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ownerId, setOwnerId] = useState<string | undefined>()

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(get({ id: data.userId || data.id }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, data.userId, data.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOut = async () => {
    setLoading(true)
    const params = {
      id: ownerId,
      userId: '-1',
      state: '2002',
      startTime: new Date().toISOString().split('T')[0],
      endTime: new Date().toISOString().split('T')[0]
    }
    try {
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) throw new Error(res.error.message)
      navigate(-1)
      message.success('退房成功')
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">业主信息</Typography>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Close />}
            sx={buttonStyles('#2660ad', '#1d428a')}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: '1px solid #e7eaec' }}>
          <Box>
            <img
              style={{ width: '200px', height: '100%' }}
              src="http://demo.homecommunity.cn/img/noPhoto.jpg"
              alt="Zenwell Logo"
            />
          </Box>
          <Box sx={{ ml: 7 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {[
                { label: '业主ID', value: owner.id },
                { label: '名称', value: owner.name },
                { label: '性别', value: owner.sex },
                { label: '年龄', value: owner.age },
                { label: '身份证', value: owner.idCard },
                { label: '联系方式', value: owner.link },
                { label: '创建员工', value: owner.userId },
                { label: '备注', value: owner.remark }
              ].map((item, index) => (
                <Grid key={index} size={{ md: 4 }} sx={{ my: 1 }}>
                  <Box>
                    {item.label}：{item.value}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      {owner.room?.map(items => (
        <Box key={items.id} sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{items.roomNum}房屋 信息</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Close />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => {
                setDelOpen(true)
                setOwnerId(items.id)
              }}
            >
              我要退房
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid #e7eaec'
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ width: '100%' }}
            >
              {[
                {
                  label: '房屋编号',
                  value: `${items.unit?.floor?.name}-${items.unit?.unitNum}-${items.roomNum}`
                },
                { label: '楼层', value: items.layer },
                { label: '房屋ID', value: items.id },
                { label: '建筑面积', value: items.builtUpArea },
                { label: '户型', value: items.apartment },
                { label: '房间数', value: items.section }
              ].map((item, index) => (
                <Grid key={index} size={{ xs: 4, sm: 4, md: 3 }} sx={{ ml: 1 }}>
                  <Box sx={{ ml: 1 }}>
                    {item.label}：{item.value}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ))}
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningRounded />
          <span style={{ margin: '10px' }}>请确认您的操作!</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>确认是否退房，退房后可以再次售卖</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setDelOpen(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            sx={buttonStyles('#2660ad', '#1d428a')}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} color="inherit" />}
            onClick={handleOut}
          >
            {loading ? '确定中...' : '确定'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default memo(CheckOut)
