import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/venue'
import { find as timeFind } from 'modules/property/spaceOpenTime'
import { RichTreeView } from '@mui/x-tree-view'
import { Box, FormControl, Stack, TextField, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import { VenueReply } from 'api/model/property/venueModel'
import { DataGrid } from '@mui/x-data-grid'
import FormDialog from './components/FormDialog'

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '20%'
})

const RolesIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.VenueSlice)
  const { list: timeList } = useSelector((state: RootState) => state.SpaceOpenTimeSlice)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogValue, setDialogValue] = useState<VenueReply>({})

  const reversedTimeList = [...timeList].reverse()

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.disable': true }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch])

  const fetchTimeData = useCallback(
    async (spaceId: string) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(timeFind({ 'page.disable': true, spaceId }))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        closeLoading()
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (dialogValue.id) {
      fetchTimeData(dialogValue.id)
    }
  }, [fetchTimeData, dialogValue.id])

  useEffect(() => {
    if (list?.length > 0) {
      setDialogValue(list[0]) // 默认选中第一项
    }
  }, [list])

  // Update dialogValue when tree selection changes
  const handleTreeSelectionChange = (itemId: string) => {
    const selectedItem = list.find(item => item.id === itemId)
    if (selectedItem) {
      setDialogValue(selectedItem) // Update dialogValue to reflect the selected tree item
    }
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl sx={{ width: { xs: '100%', md: '16ch' } }} variant="outlined">
              <TextField size="small" label="请输入巡检点名称" type="text" variant="outlined" />
            </FormControl>
          </Stack>
          <RichTreeView
            items={list.map(item => ({ id: item.id, label: item.name }))}
            selectedItems={dialogValue?.id || ''}
            onSelectedItemsChange={(_, itemId) => handleTreeSelectionChange(itemId || '')}
          />
        </Box>
        <DataGrid
          sx={{ mt: 2 }}
          disableRowSelectionOnClick
          disableColumnMenu
          rows={reversedTimeList}
          columns={[
            {
              field: 'hours',
              headerName: '预约时间',
              flex: 1,
              headerAlign: 'center',
              align: 'center'
            },
            {
              field: 'isOpen',
              headerName: '是否开放',
              flex: 1,
              headerAlign: 'center',
              align: 'center',
              renderCell: ({ row }) =>
                row.isOpen === 1 ? '可预约' : row.isOpen === 0 ? '不可预约' : '未知'
            }
          ]}
          pageSizeOptions={[100]}
        />
      </Stack>
      <Copyright />
      <FormDialog dialogValue={dialogValue} openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </Box>
  )
}

export default memo(RolesIndex)
