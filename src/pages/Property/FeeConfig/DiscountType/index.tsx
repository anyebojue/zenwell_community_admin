import { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyRoomDiscountTypeReply } from 'api/model/property/feeConfig/applyRoomDiscountTypeModel'
import { deleteByIds, find } from 'modules/property/feeConfig/applyRoomDiscountType'
import { Box, Button, Theme, Typography } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { Add } from '@mui/icons-material'
import TableData from './components/TableData'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const ApplyRoomDiscountTypeIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ApplyRoomDiscountTypeSlice)

  const [dialogValue, setDialogValue] = useState<ApplyRoomDiscountTypeReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('add')
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
      <Box sx={contentBoxStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">优惠类型</Typography>
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
          setDialogType={setDialogType}
          setDialogValue={setDialogValue}
          setSelectedRows={setSelectedRows}
          setOpenDialog={setOpenDialog}
          setDelOpen={setDelOpen}
        />
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

export default memo(ApplyRoomDiscountTypeIndex)
