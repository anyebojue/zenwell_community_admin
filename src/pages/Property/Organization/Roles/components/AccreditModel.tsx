import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { findRolesGroup, relevanceCommunity } from 'modules/platform/organization/roles'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import FormSearch from './AccreditModelFormSearch'
import AccreditModelTableData from './AccreditModelTableData'

interface AAccreditModelProps {
  dialogValue: RolesReply
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
}

const AccreditModel: React.FC<AAccreditModelProps> = ({
  dialogValue,
  associatedOpen,
  setAssociatedOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.RolesSlice)
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (!dialogValue.id || !selectedRows.size) {
      message.error('请选择有效的角色或小区')
      return
    }
    try {
      setLoading(true)
      const res = await dispatch(
        relevanceCommunity({
          userGroupId: dialogValue.id,
          communityId: [...selectedRows].join(',')
        })
      )
      if (res.meta.requestStatus === 'rejected') {
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } else if (res.meta.requestStatus === 'fulfilled') {
        message.success('关联成功')
        await dispatch(
          findRolesGroup({
            'page.num': page.num,
            'page.size': page.size,
            userGroupId: dialogValue.id || '9027404928166920193'
          })
        )
        setAssociatedOpen(false)
      }
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <FormSearch dialogValue={dialogValue} />
      </DialogTitle>
      <DialogContent>
        <AccreditModelTableData setSelectedRows={setSelectedRows} />
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={buttonStyles('darkgray', '#696969')}
          onClick={() => setAssociatedOpen(false)}
        >
          关闭
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
          onClick={onSubmit}
        >
          {loading ? '提交中...' : '提交'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(AccreditModel)
