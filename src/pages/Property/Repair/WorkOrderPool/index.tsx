import { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepairPoolReply } from 'api/model/property/repair/repairPoolModel'
import { deleteByIds, find } from 'modules/property/repair/repairPool'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal from 'components/DeleteModal'
import message from 'components/Message'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const RepairPoolIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.RepairPoolSlice)

  const [dialogValue, setDialogValue] = useState<RepairPoolReply>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedButton, setSelectedButton] = useState<number>(0)
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDeleteData = useCallback(() => {
    return Array.from(selectedRows)
      .map(id => list.find(item => item.id === id))
      .filter(item => item)
      .map(item => ({ id: item!.id!, name: item!.id! }))
  }, [selectedRows, list])

  const deleteData = getDeleteData()
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.id)

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
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '150px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {[
            { value: 0, label: '全部' },
            { value: 1000, label: '未派单' },
            { value: 1100, label: '接单' },
            { value: 1200, label: '退单' },
            { value: 1300, label: '转单' },
            { value: 1400, label: '申请支付' },
            { value: 1500, label: '支付失败' },
            { value: 1700, label: '待评价' },
            { value: 1800, label: '电话回访' },
            { value: 1900, label: '办理完成' },
            { value: 2000, label: '未办理结单' },
            { value: 2001, label: '暂停' }
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

export default memo(RepairPoolIndex)
