import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerInvoiceApplyReply } from 'api/model/property/ownerInvoiceApplyModel'
import { deleteByIds, find } from 'modules/property/ownerInvoiceApply'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'

const OwnerInvoiceApplyIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.OwnerInvoiceApplySlice)
  const [dialogValue, setDialogValue] = useState<OwnerInvoiceApplyReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id! }))
        .filter(item => item.id)
    }
    if (dialogValue) {
      return dialogValue.id ? [{ id: dialogValue.id }] : []
    }
    return []
  }, [selectedRows, list, dialogValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)

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
          find({ 'page.num': page.num, 'page.size': page.size, stateCd: selectedButton })
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
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '120px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {[
            { value: '', label: '全部' },
            { value: 'W', label: '待审核' },
            { value: 'U', label: '待上传' },
            { value: 'F', label: '审核失败' },
            { value: 'G', label: '待领用' },
            { value: 'C', label: '已领用' }
          ].map(item => (
            <Button
              key={item.value}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.value ? '#1976d2' : '#fff',
                color: selectedButton === item.value ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.value ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.value)}
            >
              {item.label}
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
            dialogValue={dialogValue}
            selectedButton={selectedButton}
            setDialogValue={setDialogValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Stack>
      <Copyright />

      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={deleteIds}
        onDelete={() => handleDelete(deleteIds)}
      />
    </Box>
  )
}

export default memo(OwnerInvoiceApplyIndex)
