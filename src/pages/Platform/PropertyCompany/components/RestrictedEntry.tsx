import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyCompanyReply } from 'api/model/platform/propertyCompanyModel'
import { find } from 'modules/platform/propertyCompany'
import { update } from 'modules/platform/organization/employees'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Stack,
  Input,
  Switch,
  Box
} from '@mui/material'
import { Lock } from '@mui/icons-material'
import dayjs from 'dayjs'
import message from 'components/Message'

interface DeleteModalProps {
  dialogValue: PropertyCompanyReply | undefined
  restrictOpen: boolean
  setRestrictOpen: Dispatch<SetStateAction<boolean>>
}

export const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const RestrictedEntry: React.FC<DeleteModalProps> = ({
  dialogValue,
  restrictOpen,
  setRestrictOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [restrictLoading, setRestrictLoading] = useState(false)
  const [dialogLocked, setDialogLocked] = useState(false)
  const [lockExpireTime, setLockExpireTime] = useState('')

  const onLock = async () => {
    const params = {
      id: dialogValue?.user.id || '',
      locked: dialogLocked ? !dialogValue?.user.locked || !!lockExpireTime : !!lockExpireTime,
      lockExpireTime: lockExpireTime
        ? dayjs(lockExpireTime).second(0).format('YYYY-MM-DD HH:mm:ss')
        : ''
    }
    try {
      setRestrictLoading(true)
      const res = await dispatch(update(params))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      message.success('操作成功')
      setRestrictOpen(false)
      setDialogLocked(params.locked)
      setLockExpireTime('')
    } catch (err: unknown) {
      setRestrictLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setRestrictLoading(false)
    }
  }

  return (
    <Dialog open={restrictOpen} onClose={() => setRestrictOpen(false)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Lock />
        <span style={{ margin: '10px' }}>锁定{dialogValue?.name}</span>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 700 }}>永久锁定</Typography>
              <Switch checked={dialogLocked} onChange={e => setDialogLocked(e.target.checked)} />
            </Stack>
            {!dialogLocked && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700 }}>截止时间</Typography>
                <Input
                  value={lockExpireTime}
                  onChange={e => setLockExpireTime(e.target.value)}
                  type="datetime-local"
                />
              </Stack>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setRestrictOpen(false)
            setLockExpireTime('')
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={restrictLoading}
          startIcon={restrictLoading && <CircularProgress size={24} color="inherit" />}
          onClick={onLock}
        >
          {restrictLoading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(RestrictedEntry)
