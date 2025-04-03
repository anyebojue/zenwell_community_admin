import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { find, update } from 'modules/property/parking/ownerCar'
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { WarningRounded } from '@mui/icons-material'

interface ReleaseProps {
  selectedButton: string
  dialogValue?: OwnerCarReply
  openRelease: boolean
  setOpenRelease: Dispatch<SetStateAction<boolean>>
}

const Release: React.FC<ReleaseProps> = ({
  selectedButton,
  dialogValue,
  openRelease,
  setOpenRelease
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OwnerCarSlice)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      try {
        const current_community = localStorage.getItem('current_community')
        const community = JSON.parse(current_community || '')
        const params = {
          ...dialogValue,
          communityId: community?.id,
          stateCd: '3003'
        }
        const action = update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { leaseType: selectedButton }),
            isExport: true
          })
        )
        message.success('释放成功')
        setOpenRelease(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dialogValue, dispatch, page.num, page.size, selectedButton, setOpenRelease]
  )

  return (
    <Dialog
      open={openRelease}
      onClose={() => setOpenRelease(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningRounded />
        <span style={{ margin: '10px' }}>释放</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>你确定要释放【{dialogValue?.parkingSpace?.num}】么？</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenRelease(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(Release)
