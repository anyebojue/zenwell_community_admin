import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReleaseTypeReply } from 'api/model/property/releaseTypeModel'
import { deleteByIds, find } from 'modules/property/releaseType'
import { Box, Button, Theme, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ReleaseTypesIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ReleaseTypeSlice)
  const [dialogValue, setDialogValue] = useState<ReleaseTypeReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [dialogType, setDialogType] = useState('add')
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, typeName: item.typeName! }))
        .filter(item => item.id && item.typeName)
    }
    if (dialogValue) {
      return dialogValue.id && dialogValue.typeName
        ? [{ id: dialogValue.id, typeName: dialogValue.typeName }]
        : []
    }
    return []
  }, [selectedRows, list, dialogValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.typeName)

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
        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch setDelOpen={setDelOpen} selectedRows={selectedRows} />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">放行类型</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => {
                setOpenDialog(true)
                setDialogType('add')
              }}
            >
              添加
            </Button>
          </Box>
          <TableData
            dialogValue={dialogValue}
            setDialogType={setDialogType}
            setDialogValue={setDialogValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setOpenDialog={setOpenDialog}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Box>
      <Copyright />

      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        dialogType={dialogType}
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

export default memo(ReleaseTypesIndex)
