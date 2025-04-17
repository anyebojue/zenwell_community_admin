import { memo, useCallback, useEffect, useState } from 'react'
import { Box, Button, Theme, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { find as findFloor } from 'modules/property/houses/floor'
import { find as findUnit } from 'modules/property/houses/unit'
import { find as findRoom } from 'modules/property/houses/room'
import FormSearch from './components/FormSearch'
import FormDialog from './components/FormDialog'
import TableData from './components/TableData'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%'
})

const RepairPoolsIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page } = useSelector((state: RootState) => state.HousingManagementSlice)
  const [openDialog, setOpenDialog] = useState(false)
  const [repairObjType, setRepairObjType] = useState(1)
  const [floorValue, setFloorValue] = useState('')
  const [unitValue, setUnitValue] = useState('')
  const [roomValue, setRommValue] = useState('')

  const fetchFloorData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findFloor({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  const fetchUnitData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findUnit({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  const fetchRoomData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findRoom({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    if (repairObjType === 2) {
      fetchFloorData()
    } else if (repairObjType === 3) {
      fetchFloorData()
      if (floorValue) {
        fetchUnitData()
      }
    } else if (repairObjType === 4) {
      fetchFloorData()
      if (unitValue) {
        fetchRoomData()
      }
    }
  }, [fetchFloorData, fetchRoomData, fetchUnitData, floorValue, repairObjType, unitValue])

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <FormSearch />
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">电话报修</Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Add />}
              sx={buttonStyles('#2660ad', '#1d428a')}
              onClick={() => setOpenDialog(true)}
            >
              登记
            </Button>
          </Box>
          <TableData />
        </Box>
      </Box>
      <Copyright />
      <FormDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        repairObjType={repairObjType}
        setRepairObjType={setRepairObjType}
        floorValue={floorValue}
        setFloorValue={setFloorValue}
        unitValue={unitValue}
        setUnitValue={setUnitValue}
        roomValue={roomValue}
        setRommValue={setRommValue}
      />
    </Box>
  )
}

export default memo(RepairPoolsIndex)
