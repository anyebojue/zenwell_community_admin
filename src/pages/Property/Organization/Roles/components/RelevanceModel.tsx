import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesReply } from 'api/model/platform/organization/rolesModel'
import { update } from 'modules/platform/organization/roles'
import { find } from 'modules/platform/organization/roles'
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
import RelevanceFormSearch from './RelevanceFormSearch'
import RelevanceModelTableData from './RelevanceModelTableData'

interface AssociatedProps {
  dialogValue: RolesReply
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const RelevanceModel: React.FC<AssociatedProps> = ({ dialogValue, open, setOpen }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (!dialogValue.id || !selectedRows.size) {
      message.error('请选择有效的组织或员工')
      return
    }
    try {
      setLoading(true)
      const res = await dispatch(
        update({
          users: [...selectedRows].join(','),
          id: dialogValue.id,
          name: dialogValue.name,
          plate: dialogValue.plate,
          word: dialogValue.word
        })
      )
      if (res.meta.requestStatus === 'rejected') {
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } else if (res.meta.requestStatus === 'fulfilled') {
        message.success('关联成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
        setOpen(false)
      }
    } catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <RelevanceFormSearch dialogValue={dialogValue} />
      </DialogTitle>
      <DialogContent>
        <RelevanceModelTableData dialogValue={dialogValue} setSelectedRows={setSelectedRows} />
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          sx={buttonStyles('darkgray', '#696969')}
          onClick={() => setOpen(false)}
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

export default memo(RelevanceModel)
