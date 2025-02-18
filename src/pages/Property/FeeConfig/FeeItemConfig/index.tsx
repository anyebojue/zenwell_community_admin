import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeConfigReply } from 'api/model/property/feeConfig/feeConfigModel'
import { deleteByIds, find } from 'modules/property/feeConfig/feeConfig'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const FeeConfigIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.FeeConfigSlice)
  const { list: FeeConfigTypeList } = useSelector((state: RootState) => state.FeeConfigTypeSlice)
  const modifiedFeeConfigTypeList = [{ id: '', name: '全部' }, ...FeeConfigTypeList]
  const [dialogValue, setDialogValue] = useState<FeeConfigReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedButton, setSelectedButton] = useState<string>('')
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
        await dispatch(
          find({ 'page.num': page.num, 'page.size': page.size, feeTypeCd: selectedButton })
        )
        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size, selectedButton]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%', height: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '150px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {modifiedFeeConfigTypeList.map(item => (
            <Button
              key={item.id}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.id ? '#1976d2' : '#fff',
                color: selectedButton === item.id ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.id ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.id || '')}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <FormSearch
            selectedButton={selectedButton}
            selectedRows={selectedRows}
            setDelOpen={setDelOpen}
          />
          <TableData
            selectedButton={selectedButton}
            setDialogValue={setDialogValue}
            setSelectedRows={setSelectedRows}
            setOpenDialog={setOpenDialog}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Stack>
      <Copyright />

      <FormDialog
        selectedButton={selectedButton}
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

export default memo(FeeConfigIndex)
