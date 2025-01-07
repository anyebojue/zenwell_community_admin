import { Dispatch, memo, SetStateAction, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material'
import { WarningRounded } from '@mui/icons-material'
import { CompanyReply } from 'api/model/platform/propertyCompanyModel'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { companydeleteById, companyfind } from 'modules/platform/propertyCompany'
import { useLocation } from 'react-router-dom'

interface ExitCellProps {
  exitOpen: boolean
  setExitOpen: Dispatch<SetStateAction<boolean>>
  dialogValue: CompanyReply | undefined
}

export const buttonStyles = (backgroundColor: string, hoverColor: string) => ({
  backgroundColor: backgroundColor,
  '&:hover': {
    backgroundColor: hoverColor
  }
})

const ExitCell: React.FC<ExitCellProps> = ({ exitOpen, setExitOpen, dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { page } = useSelector((state: RootState) => state.PropertyCompanySlice)
  const [loading, setLoading] = useState(false)

  const onExitCell = async () => {
    setLoading(true)
    try {
      const res = await dispatch(companydeleteById(dialogValue?.id!))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      setExitOpen(false)
      message.success('退出成功')
      await dispatch(
        companyfind({ 'page.num': page.num, 'page.size': page.size, storeId: location.state?.id })
      )
      setLoading(false)
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={exitOpen} onClose={() => setExitOpen(false)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningRounded />
        <span style={{ margin: '10px' }}>请确认您的操作！</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>你确定要退出【{dialogValue?.community?.name}】么？</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setExitOpen(false)}>
          点错了
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
          onClick={onExitCell}
        >
          {loading ? '加载中...' : '确定'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(ExitCell)
