import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RepairStaffReply } from 'api/model/property/repairStaffModel'
import { deleteByIds, find } from 'modules/property/repairStaff'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormDialog from './components/FormDialog'
import TableData from './components/TableData'
import TreeDialog from './components/TreeDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RepairSettingsIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { page } = useSelector((state: RootState) => state.RepairStaffSlice)
  const [dialogValue, setDialogValue] = useState<RepairStaffReply>()
  const [openDialog, setOpenDialog] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openTree, setOpenTree] = useState(false)

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
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">报修师傅</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Close />}
                onClick={() => navigate(-1)}
              >
                返回
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => setOpenTree(true)}
              >
                添加
              </Button>
            </Stack>
          </Box>
          <TableData
            setDialogValue={setDialogValue}
            setOpenDialog={setOpenDialog}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Box>
      <Copyright />

      <TreeDialog openTree={openTree} setOpenTree={setOpenTree} />
      <FormDialog dialogValue={dialogValue} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={[dialogValue?.staffName!]}
        onDelete={() => handleDelete([dialogValue?.id!])}
      />
    </Box>
  )
}

export default memo(RepairSettingsIndex)
