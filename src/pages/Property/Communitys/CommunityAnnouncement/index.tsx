import { memo, useCallback, useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Stack } from '@mui/material'
import NavbarBreadcrumbs from 'layouts/components/Header/NavbarBreadcrumbs'
import Copyright from 'layouts/components/Copyright'
import DeleteModal from 'components/DeleteModal'
import { useDispatch } from 'react-redux'
import message from 'components/Message'
import { deleteByIds, find } from 'modules/platform/organizationInfo'
import { OrganizationInfoReply, OrgUserReply } from 'api/model/platform/organizationInfoModel'
import FormSearch from './components/FormSearch'
import TableData from './components/TableData'
import FormDialog from './components/FormDialog'

const CommunityAnnouncementIndex = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [dialogValue, setDialogValue] = useState<OrganizationInfoReply>({})
  const [dialogUserValue, setDialogUserValue] = useState<OrgUserReply>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | undefined>>(new Set())
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [delOpen, setDelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    setLoading(true)
    try {
      const res = await dispatch(find({ pId: '0' }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
        await dispatch(find({ pId: '0' }))
      } catch (err) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const findItemById = useCallback(
    (items: OrganizationInfoReply[], targetId: string): OrganizationInfoReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    []
  )

  return (
    <Box sx={{ mt: 3.5, width: '100%', height: '100%' }}>
      <NavbarBreadcrumbs />
      <Stack sx={{ mt: 2, mb: 1.5, width: '100%' }} direction="row" spacing={3}>
        <ButtonGroup
          sx={{
            width: '350px'
          }}
          orientation="vertical"
          aria-label="Vertical button group"
        >
          {[
            { value: '0', label: '公共收益' },
            { value: '1', label: '规章制度' },
            { value: '2', label: '政策相关' }
          ].map(item => (
            <Button
              key={item.value}
              size="large"
              sx={{
                backgroundColor: selectedButton === item.label ? '#1976d2' : '#fff',
                color: selectedButton === item.label ? '#fff' : '#000',
                lineHeight: 2.5,
                '&:hover': {
                  backgroundColor: selectedButton === item.label ? '#1565c0' : '#f0f0f0'
                }
              }}
              onClick={() => setSelectedButton(item.label)}
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{ width: '100%' }}>
          <FormSearch dialogValue={dialogValue} />
          <TableData
            dialogValue={dialogValue}
            dialogUserValue={dialogUserValue}
            setDialogUserValue={setDialogUserValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </Box>
      </Stack>
      <Copyright />
      <FormDialog
        dialogValue={dialogValue}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogType={dialogType}
      />
      <DeleteModal
        loading={loading}
        delOpen={delOpen}
        setDelOpen={setDelOpen}
        userName={[dialogValue.name as string]}
        onDelete={() => handleDelete([dialogValue.id as string])}
      />
    </Box>
  )
}

export default memo(CommunityAnnouncementIndex)
