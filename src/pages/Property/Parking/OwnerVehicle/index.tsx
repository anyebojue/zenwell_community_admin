import { memo, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import { deleteByIds, find } from 'modules/property/parking/ownerCar'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import message from 'components/Message'
import { Add, Download } from '@mui/icons-material'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'
import ImportVehicle from './components/ImportVehicle'
import Discount from './components/Discount'

const OwnerCarIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list, exportUrl } = useSelector((state: RootState) => state.OwnerCarSlice)
  const leaseTypeList = [
    { id: '', name: '全部车辆' },
    { id: 'H', name: '月租车' },
    { id: 'S', name: '出售车' },
    { id: 'I', name: '内部车' },
    { id: 'NM', name: '免费车' },
    { id: 'R', name: '预约车' },
    { id: 'C', name: '到期车辆' }
  ]
  const [dialogValue, setDialogValue] = useState<OwnerCarReply | undefined>()
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('add')
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openImportVehicle, setOpenImportVehicle] = useState(false)
  const [openDiscount, setOpenDiscout] = useState(false)

  const getDeleteData = useCallback(() => {
    if (selectedRows.size > 0) {
      return list
        .filter(item => selectedRows.has(item.id))
        .map(item => ({ id: item.id!, carNum: item.carNum! }))
        .filter(item => item.id && item.carNum)
    }
    if (dialogValue) {
      return dialogValue.id && dialogValue.carNum
        ? [{ id: dialogValue.id, carNum: dialogValue.carNum }]
        : []
    }
    return []
  }, [selectedRows, list, dialogValue])

  const deleteData = useMemo(() => getDeleteData(), [getDeleteData])
  const deleteIds = deleteData.map(item => item.id)
  const deleteNames = deleteData.map(item => item.carNum)

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
          find({
            'page.num': page.num,
            'page.size': page.size,
            ...(selectedButton && { leaseType: selectedButton }),
            isExport: true
          })
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
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={1.5}>
        <ButtonGroup
          sx={{ width: '150px' }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {leaseTypeList.map(item => (
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
        <Box sx={{ width: '100%', height: '100%' }}>
          <FormSearch
            dialogType={dialogType}
            setDialogType={setDialogType}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            selectedButton={selectedButton}
            selectedRows={selectedRows}
            setDelOpen={setDelOpen}
          />
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Add />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => setOpenImportVehicle(true)}
              >
                车辆导入
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Download />}
                sx={buttonStyles('#2660ad', '#1d428a')}
                onClick={() => {
                  if (exportUrl) {
                    window.open(exportUrl, '_blank')
                  } else {
                    alert('暂无导出链接')
                  }
                }}
              >
                导出
              </Button>
            </Stack>
            <TableData
              dialogValue={dialogValue}
              openDiscount={openDiscount}
              setDialogType={setDialogType}
              selectedButton={selectedButton}
              setDialogValue={setDialogValue}
              setSelectedRows={setSelectedRows}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setDelOpen={setDelOpen}
              setOpenDiscout={setOpenDiscout}
            />
          </Box>
        </Box>
      </Stack>
      <Copyright />
      <FormDialog
        selectedButton={selectedButton}
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
      <ImportVehicle
        openImportVehicle={openImportVehicle}
        setOpenImportVehicle={setOpenImportVehicle}
      />
      <Discount
        selectedButton={selectedButton}
        dialogValue={dialogValue}
        openDialog={openDiscount}
        setOpenDialog={setOpenDiscout}
      />
    </Box>
  )
}

export default memo(OwnerCarIndex)
