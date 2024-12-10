import { memo, useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal from 'components/DeleteModal'
import { deleteByIds, find } from 'modules/community'
import { useDispatch, useSelector } from 'react-redux'
import message from 'components/Message'
import { CommunityReply } from 'api/model/communityModel'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const CommunityIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.CommunitySlice)
  const [dialogValue, setDialogValue] = useState<CommunityReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  const DelName =
    selectedRows.size === 0
      ? dialogValue?.name
        ? [dialogValue.name]
        : []
      : (list
          .filter(item => selectedRows.has(item.id))
          .map(item => item.name)
          .filter(Boolean) as string[])

  const DelData =
    selectedRows.size === 0
      ? dialogValue?.id
        ? [dialogValue.id]
        : []
      : (list
          .filter(item => selectedRows.has(item.id))
          .map(item => item.id)
          .filter(Boolean) as string[])

  const handleDelete = useCallback(
    async (id: string[]) => {
      try {
        await dispatch(deleteByIds(id))
        setDelOpen(false)
        message.success('删除成功')
        await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      }
    },
    [dispatch, page.num, page.size]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch setDelOpen={setDelOpen} selectedRows={selectedRows} />
      <TableData
        setDialogValue={setDialogValue}
        selectedRows={selectedRows}
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
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={DelName}
        onDelete={() => handleDelete(DelData)}
      />
    </Box>
  )
}

export default memo(CommunityIndex)
