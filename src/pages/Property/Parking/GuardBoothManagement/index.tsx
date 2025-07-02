import { memo, useCallback, useMemo, useState } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { Add } from '@mui/icons-material'
import { find, deleteByIds } from 'modules/property/parking/parkingBox'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { ParkingBoxReply } from 'api/model/property/parking/parkingBoxModel'
import message from 'components/Message'
import { useDispatch, useSelector } from 'react-redux'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const GuardBoothManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ParkingBoxSlice)
  const [dialogValue, setDialogValue] = useState<ParkingBoxReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('add')
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, boxName: item.boxName! }))
        .filter(item => item.id && item.boxName)
    }
    if (dialogValue) {
      return dialogValue.id && dialogValue.boxName
        ? [{ id: dialogValue.id, boxName: dialogValue.boxName }]
        : []
    }
    return []
  }, [selectedRows, list, dialogValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.boxName)

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
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <FormSearch />
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">岗亭信息</Typography>
          <Box>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              添加
            </Button>
          </Box>
        </Box>
        <TableData
          setDialogValue={setDialogValue}
          setDialogType={setDialogType}
          setOpenDialog={setOpenDialog}
          setDelOpen={setDelOpen}
          setSelectedRows={setSelectedRows}
        />
      </Box>
      <Copyright />
      <FormDialog
        dialogType={dialogType}
        dialogValue={dialogValue}
        openDialog={openDialog}
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

export default memo(GuardBoothManagementIndex)
