import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'modules/property/houses/venue'
import { find as spaceFind } from 'modules/property/houses/space'
import { RichTreeView } from '@mui/x-tree-view'
import { Box, FormControl, Stack, TextField, Theme } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import { VenueReply } from 'api/model/property/houses/venueModel'
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import FormDialog from './components/FormDialog'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: '1px solid',
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid',
      borderColor: 'primary.main'
    }
  }
}

const treeViewStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '20%'
})

const RolesIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.VenueSlice)
  const { list: spaceList } = useSelector((state: RootState) => state.SpaceSlice)
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [openDialog, setOpenDialog] = useState(false)
  const [spaceId, setSpaceId] = useState('')
  const [spaceTime, setSpaceTime] = useState('')
  const [dialogValue, setDialogValue] = useState<VenueReply>({})

  const result = Array.from({ length: 24 }, (_, hour) => {
    const obj: { id: string; 预约时间: string; [key: string]: string } = {
      id: `${hour}`,
      预约时间: `${hour}点`
    }
    spaceList.forEach(item => {
      if (item.name) {
        const status = item.spaceOpenTime?.some(
          openTime => openTime.hours === hour && openTime.isOpen === 1
        )
          ? '可预约'
          : '不可预约'
        obj[item.name] = status
      }
    })
    return obj
  })

  const columns: GridColDef[] = [
    {
      field: '预约时间',
      headerName: '预约时间',
      flex: 1,
      headerAlign: 'center' as 'center',
      align: 'center' as 'center',
      type: 'string'
    },
    ...Object.keys(result[0] || {})
      .filter(key => key !== '预约时间' && key !== 'id')
      .map(key => {
        return {
          field: key,
          headerName: key,
          flex: 1,
          headerAlign: 'center' as 'center',
          align: 'center' as 'center',
          type: 'string' as const,
          renderCell: (params: GridCellParams) => {
            const isClickable = params.value === '可预约'
            const value = params.value as string
            const appointmentTime = params.row.预约时间
            return (
              <div
                onClick={() => {
                  if (isClickable) {
                    const itemId = spaceList.find(item => item.name === key)?.id
                    setSpaceTime(appointmentTime.replace('点', ''))
                    setOpenDialog(true)
                    setSpaceId(itemId || '')
                  }
                }}
                style={{
                  cursor: isClickable ? 'pointer' : 'default',
                  color: isClickable ? 'blue' : 'inherit',
                  textDecoration: isClickable ? 'underline' : 'none'
                }}
              >
                {value}
              </div>
            )
          }
        }
      })
  ]

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

  const fetchSpaceData = useCallback(
    async (id: string) => {
      const closeLoading = message.loading('正在加载列表中，请稍后...')
      try {
        const res = await dispatch(spaceFind({ 'page.disable': true, venueId: id }))
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
      fetchSpaceData(dialogValue.id)
    }
  }, [dialogValue, fetchSpaceData])

  useEffect(() => {
    if (list?.length > 0) {
      setDialogValue(list[0])
    }
  }, [list])

  const handleTreeSelectionChange = (itemId: string) => {
    const selectedItem = list.find(item => item.id === itemId)
    if (selectedItem) {
      setDialogValue(selectedItem)
    }
  }

  const handeleTime = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const selectedDate = e.target.value
    const closeLoading = message.loading('正在加载中，请稍后...')
    try {
      const res = await dispatch(spaceFind({ appointmentTime: selectedDate }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
      setDate(selectedDate)
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <Box sx={treeViewStyle}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl sx={{ width: { xs: '100%', md: '16ch' } }} variant="outlined">
              <TextField
                size="small"
                type="date"
                variant="outlined"
                sx={textFieldStyles}
                value={date}
                onChange={e => handeleTime(e)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
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
          rows={result}
          columns={columns}
          pageSizeOptions={[100]}
        />
      </Stack>
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        spaceTime={spaceTime}
        spaceId={spaceId}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </Box>
  )
}

export default memo(RolesIndex)
