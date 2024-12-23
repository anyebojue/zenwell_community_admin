import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EmployeesReply } from 'api/model/platform/employeesModel'
import { RolesReply } from 'api/model/platform/rolesModel'
import { find } from 'modules/platform/roles'
import { Box, Theme } from '@mui/material'
import DeleteModal from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './RelevanceTableFormSearch'
import RelevanceTableData from './RelevanceTableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

interface RelevanceProps {
  dialogValue: RolesReply
}

const Relevance: React.FC<RelevanceProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RolesSlice)
  const [dialogEmployessValue, setDialogEmployessValue] = useState<EmployeesReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, name: item.name! }))
        .filter(item => item.id && item.name)
    }
    if (dialogValue) {
      return dialogValue.id && dialogValue.name
        ? [{ id: dialogValue.id, name: dialogValue.name }]
        : []
    }
    return []
  }, [selectedRows, list, dialogValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (_: string[]) => {
      setLoading(true)
      try {
        // const res = await dispatch(deleteOrgUserByIds(ids))
        // if ('error' in res && res.error?.message) {
        //   throw new Error(res.error.message)
        // }
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  return (
    <Box sx={contentBoxStyle}>
      <FormSearch
        selectedRows={selectedRows}
        setDelOpen={setDelOpen}
        dialogValue={dialogValue}
        dialogEmployessValue={dialogEmployessValue}
        setDialogEmployessValue={setDialogEmployessValue}
      />
      <RelevanceTableData
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        dialogValue={dialogValue}
        setDialogEmployessValue={setDialogEmployessValue}
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

export default memo(Relevance)
