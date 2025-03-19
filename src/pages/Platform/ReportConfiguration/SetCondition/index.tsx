import { memo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteByIds,
  find
} from 'modules/platform/reportConfiguration/reportCustomComponentCondition'
import { Box, Button, Stack, Theme, Typography } from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import message from 'components/Message'
import DeleteModal, { buttonStyles } from 'components/DeleteModal'
import { ReportCustomComponentConditionReply } from 'api/model/platform/reportConfiguration/reportCustomComponentConditionModel'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const contentBoxStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  borderRadius: '15px',
  padding: '15px 15px',
  width: '100%',
  marginTop: '15px'
})

const HousingManagementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const value = location.state.value
  const { page, list } = useSelector(
    (state: RootState) => state.ReportCustomComponentConditionSlice
  )
  const [dialogValue, setDialogValue] = useState<ReportCustomComponentConditionReply>({})
  const [dialogType, setDialogType] = useState<string>('add')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [openDialog, setOpenDialog] = useState(false)
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
          find({ 'page.num': page.num, 'page.size': page.size, componentId: value.id })
        )
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, page.num, page.size, value.id]
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Box sx={{ width: '100%' }}>
        <Box sx={contentBoxStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{value.name}组件</Typography>
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
                onClick={() => {
                  setOpenDialog(true)
                  setDialogType('add')
                }}
              >
                添加
              </Button>
            </Stack>
          </Box>
          <TableData
            setDialogValue={setDialogValue}
            setDialogType={setDialogType}
            valueData={value}
            setSelectedRows={setSelectedRows}
            setDelOpen={setDelOpen}
          />
        </Box>
      </Box>
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        dialogType={dialogType}
        valueData={value}
        openDialog={openDialog}
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

export default memo(HousingManagementIndex)
