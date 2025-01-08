import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerReply } from 'api/model/property/ownerModel'
import { find, deleteByIds } from 'modules/property/owner'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import Associated from './components/Associated'
import FormDialog from './components/FormDialog'

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const buttonCommonStyle = (color: string = '#2660ad', height: string = '32px') => ({
  ...buttonStyles(color, '#1d428a'),
  fontSize: '0.85rem',
  minWidth: '80px',
  height
})

const InfoIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerSlice)
  const [dialogValue, setDialogValue] = useState<OwnerReply | undefined>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [associatedOpen, setAssociatedOpen] = useState(false)
  const [ownerUser, setOwnerUser] = useState<OwnerReply>()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('add')
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
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1.5,
              borderBottom: '1px solid #e7eaec'
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '16px' }}>
              业主信息
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonCommonStyle()}
                onClick={() => setAssociatedOpen(true)}
              >
                选择业主
              </Button>
              {ownerUser && (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Add />}
                  sx={buttonCommonStyle()}
                  onClick={() => {
                    setOpenDialog(true)
                    setDialogType('add')
                  }}
                >
                  添加成员
                </Button>
              )}
            </Stack>
          </Box>
          <Box sx={{ pt: 1 }}>
            {[
              { label: '业主ID：', value: ownerUser?.id },
              { label: '名称', value: ownerUser?.name },
              { label: '性别', value: ownerUser?.sex },
              { label: '身份证', value: ownerUser?.idCard },
              { label: '联系方式', value: ownerUser?.link },
              { label: '备注', value: ownerUser?.remark }
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1
                }}
              >
                <Box sx={{ py: 1 }}>{item.label}：</Box>
                <Box>{item.value}</Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ width: '350%' }}>
          <FormSearch dialogValue={dialogValue} />
          <TableData
            dialogValue={dialogValue}
            setDialogValue={setDialogValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setOpenDialog={setOpenDialog}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Stack>
      <Copyright />

      <FormDialog
        ownerUser={ownerUser}
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
      <Associated
        setOwnerUser={setOwnerUser}
        associatedOpen={associatedOpen}
        setAssociatedOpen={setAssociatedOpen}
      />
    </Box>
  )
}

export default memo(InfoIndex)
