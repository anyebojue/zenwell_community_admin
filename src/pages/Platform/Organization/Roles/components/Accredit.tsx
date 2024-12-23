import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RolesGroupReply, RolesReply } from 'api/model/platform/rolesModel'
import { CommunityReply } from 'api/model/platform/communityModel'
import { deleteRolesGroupByIds, findRolesGroup } from 'modules/platform/roles'
import { Box, Button, Stack, Theme } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import AccreditTableData from './AccreditTableData'
import AccreditModel from './AccreditModel'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface AccreditProps {
  dialogValue: RolesReply
}

const Accredit: React.FC<AccreditProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, rolesGroupList } = useSelector((state: RootState) => state.RolesSlice)
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [dialogGroupValue, setDialogGroupValue] = useState<RolesGroupReply>({})
  const [dialogCommunityValue, setDialogCommunityValue] = useState<CommunityReply | undefined>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return rolesGroupList
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.community?.name! }))
        .filter(item => item.id && item.name)
    }
    if (dialogCommunityValue) {
      return dialogCommunityValue.id && dialogCommunityValue?.name
        ? [{ id: dialogCommunityValue.id, name: dialogCommunityValue?.name }]
        : []
    }
    return []
  }, [selectedRows, rolesGroupList, dialogCommunityValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteRolesGroupByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(
          findRolesGroup({
            'page.num': page.num,
            'page.size': page.size,
            userGroupId: dialogValue.id || '9027404928166920193'
          })
        )
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size, dialogValue.id]
  )

  return (
    <Box sx={contentBoxStyle}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Add />}
          sx={buttonStyles('#2660ad', '#1d428a')}
          onClick={() => setAssociatedOpen(true)}
        >
          关联小区
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          sx={buttonStyles('#B22222', '#8B0000')}
          onClick={() => {
            if (![...selectedRows].length) {
              return message.warning('请选择至少一项')
            }
            setDelOpen(true)
          }}
        >
          批量删除
        </Button>
      </Stack>
      <AccreditTableData
        dialogValue={dialogValue}
        dialogGroupValue={dialogGroupValue}
        setDialogGroupValue={setDialogGroupValue}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setDelOpen={setDelOpen}
      />
      <AccreditModel
        dialogValue={dialogValue}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
        dialogCommunityValue={dialogCommunityValue}
        setDialogCommunityValue={setDialogCommunityValue}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteNames}
        onDelete={() => handleDelete(deleteIds)}
      />
    </Box>
  )
}

export default memo(Accredit)
