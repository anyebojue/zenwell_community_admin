import { Dispatch, memo, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OrganizationInfoReply } from 'api/model/platform/organization/organizationInfoModel'
import { EmployeesReply } from 'api/model/platform/organization/employeesModel'
import { findOrgUser, relevanceOrgUser } from 'modules/platform/organization/organizationInfo'
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
import FormSearch from './FormSearch'
import AssociatedTableData from './AssociatedTableData'

interface AssociatedProps {
  dialogValue: OrganizationInfoReply
  associatedOpen: boolean
  setAssociatedOpen: Dispatch<SetStateAction<boolean>>
  dialogEmployessValue: EmployeesReply | undefined
  setDialogEmployessValue: Dispatch<SetStateAction<EmployeesReply | undefined>>
}

const Associated: React.FC<AssociatedProps> = ({
  dialogValue,
  associatedOpen,
  setAssociatedOpen,
  setDialogEmployessValue
}) => {
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
        relevanceOrgUser({ orgId: dialogValue.id, userId: [...selectedRows].join(',') })
      )
      if (res.meta.requestStatus === 'rejected') {
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } else if (res.meta.requestStatus === 'fulfilled') {
        message.success('关联成功')
        await dispatch(
          findOrgUser({
            'page.num': page.num,
            'page.size': page.size,
            orgId: dialogValue.id || '9027438861059358721'
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
    <Dialog maxWidth="md" open={associatedOpen} onClose={() => setAssociatedOpen(false)}>
      <DialogTitle>
        <FormSearch dialogValue={dialogValue} />
      </DialogTitle>
      <DialogContent>
        <AssociatedTableData
          dialogValue={dialogValue}
          setDialogEmployessValue={setDialogEmployessValue}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
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

export default memo(Associated)
