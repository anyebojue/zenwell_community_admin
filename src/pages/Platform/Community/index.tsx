import { memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommunityReply } from 'api/model/platform/communityModel'
import { deleteByIds, find } from 'modules/platform/community'
import { Box } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import DeleteModal from 'components/DeleteModal'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const CommunityIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)

  const [dialogValue, setDialogValue] = useState<CommunityReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    return Array.from(selectedRows)
      .map(id => list.find(item => item.id === id))
      .filter(item => item)
      .map(item => ({ id: item!.id!, name: item!.name! }))
  }, [selectedRows, list])

  const deleteData = getDeleteData()
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.name)

  const handleDelete = useCallback(
    async (ids: string[]) => {
      setLoading(true)
      try {
        const res = await dispatch(deleteByIds(ids))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch setDelOpen={setDelOpen} selectedRows={selectedRows} />
      <TableData
        setDialogValue={setDialogValue}
        setSelectedRows={setSelectedRows}
        setOpenDialog={setOpenDialog}
        setDelOpen={setDelOpen}
      />
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        dialogType="edit"
        setOpenDialog={setOpenDialog}
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

export default memo(CommunityIndex)
