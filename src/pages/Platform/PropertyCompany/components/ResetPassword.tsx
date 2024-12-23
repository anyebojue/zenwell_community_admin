import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PropertyCompanyReply } from 'api/model/platform/propertyCompanyModel'
import { find, update } from 'modules/platform/employees'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  DialogContentText
} from '@mui/material'
import { RestartAlt } from '@mui/icons-material'
import message from 'components/Message'

interface DeleteModalProps {
  dialogValue: PropertyCompanyReply | undefined
  passwordOpen: boolean
  setPasswordOpen: Dispatch<SetStateAction<boolean>>
}

export const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const RestrictedEntry: React.FC<DeleteModalProps> = ({
  dialogValue,
  passwordOpen,
  setPasswordOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const onPassword = async () => {
    try {
      setPasswordLoading(true)
      const res = await dispatch(
        update({ id: dialogValue?.user.id, password: dialogValue?.user.mobile })
      )
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      message.success('操作成功')
      setPasswordOpen(false)
    } catch (err: unknown) {
      if (err instanceof Error) message.error(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <RestartAlt />
        <span style={{ margin: '10px' }}>请确认您的操作！</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>确认是否重置{dialogValue?.name}密码么？</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setPasswordOpen(false)}>
          点错了
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={passwordLoading}
          startIcon={passwordLoading && <CircularProgress size={24} color="inherit" />}
          onClick={onPassword}
        >
          {passwordLoading ? '重置中...' : '确认重置'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(RestrictedEntry)
